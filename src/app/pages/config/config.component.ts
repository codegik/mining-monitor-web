import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpModule, Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';
import { DashboardEditComponent } from './dashboard-edit.component';
import * as io from "socket.io-client";

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: [
    './config.component.scss'
  ]
})
export class ConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  private socket: any;
  public config: any = {};
  public isSaving = false;

  constructor(
    public appService: AppService) {
    appService.getState().topnavTitle = 'Configuration';
    appService.getState().pageFooter = true;
    appService.getState().disconnected = true;
    this.socket = io(environment.backendSocketUrl);
  }

  ngOnInit(): void {
    this.socket.on('getConfig', (result: any) => { this.onGetConfig(result); });
    this.socket.on('onSaveConfig', (result: any) => { this.onSaveConfig(result); });
    this.socket.on('connect', () => { this.onConnect(); });
    this.socket.on('disconnect', () => { this.onDisconnect(); });
    this.socket.emit('onConfig');
  }

  ngOnDestroy() {
    this.appService.getState().pageFooter = false;
  }

  ngAfterViewInit() {
    if (!this.appService.getState().initial) {
      this.appService.getState().initial = true;
    }
  }

  private onGetConfig(config: any): void {
    this.config = config;
    console.log(config);
  }

  private onSaveConfig(result: any): void {
    var update = () => {
      this.isSaving = false;  
    }
    setTimeout(update, 1000 * 3);
  }

  private onConnect() {
    this.appService.getState().disconnected = false;
  }

  private onDisconnect() {
    this.appService.getState().disconnected = true;
  }

  public save(config: any): void {
    if (config) {
      this.isSaving = true;
      this.socket.emit('saveConfig', config);
    }
  }
}
