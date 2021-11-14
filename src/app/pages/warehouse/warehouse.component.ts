import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpModule, Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';
import { DashboardEditComponent } from './dashboard-edit.component';
import * as io from "socket.io-client";

@Component({
  selector: 'warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: [
    './warehouse.component.scss'
  ]
})
export class WarehouseComponent implements OnInit, AfterViewInit, OnDestroy {
  private socket: any;
  public warehouseList: any[];
  public warehouse: any;
  public isSaving = false;

  constructor(
    public appService: AppService) {
    appService.getState().topnavTitle = 'Warehouse';
    appService.getState().pageFooter = true;
    appService.getState().disconnected = true;
    this.socket = io(environment.backendSocketUrl);
    this.warehouse = this.buildWarehouse();
    this.warehouseList = [];
  }

  ngOnInit(): void {
    this.socket.on('getWarehouseList', (result: any) => { this.getWarehouseList(result); });
    this.socket.on('onSaveWarehouse', (result: any) => { this.onSaveWarehouse(result); });
    this.socket.on('connect', () => { this.onConnect(); });
    this.socket.on('disconnect', () => { this.onDisconnect(); });
    this.socket.emit('onWarehouse');
  }

  ngOnDestroy() {
    this.appService.getState().pageFooter = false;
  }

  ngAfterViewInit() {
    if (!this.appService.getState().initial) {
      this.appService.getState().initial = true;
    }
  }

  private buildWarehouse(): any {
    return {
      chambers: [{
        name: '1',
        temperature1: null,
        temperature2: null,
        humidity: null
      }, {
        name: '2',
        temperature1: null,
        temperature2: null,
        humidity: null
      }, {
        name: '3',
        temperature1: null,
        temperature2: null,
        humidity: null
      }],
      outside: {
        name: 'External',
        temperature1: null,
        temperature2: null,
        humidity: null
      },
      indicators: [{
        user: 'paterminer',
        statistic: {}
      }, {
        user: 'versa',
        statistic: {}
      }]
    };
  }

  private getWarehouseList(warehouseList: any): void {
    this.warehouseList = warehouseList;
  }

  private onSaveWarehouse(result: any): void {
    console.log(result);
    var update = () => {
      this.isSaving = false;
    }
    setTimeout(update, 1000 * 2);
  }

  private onConnect() {
    this.appService.getState().disconnected = false;
  }

  private onDisconnect() {
    this.appService.getState().disconnected = true;
  }

  public insert(warehouse: any): void {
    if (warehouse) {
      this.isSaving = true;
      this.socket.emit('saveWarehouse', warehouse);
      this.warehouse = this.buildWarehouse();
    }
  }
}
