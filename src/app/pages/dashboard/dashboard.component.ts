import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { HttpModule, Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';
import { DashboardEditComponent } from './dashboard-edit.component';
import * as io from "socket.io-client";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss'
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private socket: any;
  private sortBy = 'temp';
  public selectedUser = '';
  public users = ['all', 'paterminer', 'versa'];
  public places: any = {};
  public s9miners: any[] = [];
  public indicators: any = {
    scannedDate: null,
    s9UnknownLocation: 0,
    s9TotalDanger: 0,
    s9TotalWarning: 0,
    s9TotalInfo: 0,
    s9TotalNormal: 0,
    s9TotalHashboardIssue: 0,
    s9TotalHashes: 0,
    s9TotalHashesLabel: ""
  };
  public status: any = {
    "W": "Warning",
    "I": "Informational",
    "S": "Success",
    "E": "Error",
    "F": "Fatal (code bug)"
  };
  public classStyle: any[] = [
    "",
    "alert-info",
    "alert-warning",
    "alert-danger"
  ];

  constructor(
    public appService: AppService,
    private elementRef: ElementRef,
    private http: Http,
    public dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router) {
    this.appService.getState().topnavTitle = 'Dashboard';
    this.appService.getState().pageFooter = true;
    this.appService.getState().disconnected = true;
    this.socket = io(environment.backendSocketUrl);
  }

  ngOnInit(): void {
    this.socket.on('getMiners', (result: any[]) => { this.onGetMiners(result); });
    this.socket.on('getIndicators', (result: any[]) => { this.onGetIndicators(result); });
    this.socket.on('getMapPlaces', (result: any[]) => { this.onGetMapPlaces(result); });
    this.socket.on('onShutdown', (result: any[]) => { this.onShutdown(result); });
    this.socket.on('onReboot', (result: any[]) => { this.onReboot(result); });
    this.socket.on('connect', () => { this.onConnect(); });
    this.socket.on('disconnect', () => { this.onDisconnect(); });
  }

  ngOnDestroy() {
    this.appService.getState().pageFooter = false;
  }

  ngAfterViewInit() {
    if (!this.appService.getState().initial) {
      this.appService.getState().initial = true;
    }
  }

  private onConnect() {
    this.appService.getState().disconnected = false;
    this.route.params.subscribe(params => {
      var filters = JSON.parse(JSON.stringify(params));
      console.log(filters);
      this.sortBy = filters['sort'] || 'temp';
      this.selectedUser = filters['user'] || 'all';
      this.appService.getState().topnavTitle = 'Dashboard / ' + (filters['user'] || 'All users');
      if (this.selectedUser == 'all') {
        filters['user'] = '';
      }
      this.onGetMiners(this.s9miners);
      this.socket.emit('onDashboard', filters);
    });
  }

  private onDisconnect() {
    this.appService.getState().disconnected = true;
  }

  private onShutdown(result: any): void {
    console.log(result);
  }

  private onReboot(result: any): void {
    console.log(result);
  }

  private onGetMapPlaces(result: any): void {
    this.places = result;
  }

  private onGetIndicators(indicators: any): void {
    this.indicators = indicators;
  }

  private onGetMiners(miners: any[]): void {
    this.s9miners = this.sort(miners);
    console.log(miners);
  }

  public checkTemperature(miner: any): String {
    if (miner) {
      return this.classStyle[miner.alerts.temperature];
    }
    return "";
  }

  public checkHashboard(miner: any): String {
    if (miner) {
      return this.classStyle[miner.alerts.hashboard];
    }
    return "";
  }

  public shutdown(miner: any): void {
    miner.isLoading = true;
    this.socket.emit('shutdown', miner);
  }

  public reboot(miner: any): void {
    miner.isLoading = true;
    this.socket.emit('reboot', miner);
  }

  public edit(miner: any): void {
    let dialogRef = this.dialog.open(DashboardEditComponent, {
      width: '250px',
      data: miner
    });

    dialogRef.afterClosed().subscribe(place => {
      if (place) {
        place.macaddress = miner.network.macaddress;
        this.socket.emit('savePlace', place);
      }
    });
  }

  private sort(miners: any[]): any[] {
    if (this.sortBy == 'temp') {
      return this.sortByTempDesc(miners);
    } else if (this.sortBy == 'hashboard') {
      return this.sortByHashboardDesc(miners);
    }
    return this.sortByTempDesc(miners);
  }

  private sortByHashboardDesc(miners: any[]): any[] {
    var compareMiners = function (a, b) {
      var alertA = a.alerts.hashboard;
      var alertB = b.alerts.hashboard;

      if (alertA < alertB) {
        return 1;
      } else if (alertA > alertB) {
        return -1;
      }

      return 0;
    };

    return miners.sort(compareMiners);
  }

  private sortByTempDesc(miners: any[]): any[] {
    var compareMiners = function (a, b) {
      var alertA = a.alerts.temperature;
      var alertB = b.alerts.temperature;
      var tempA = a.temperature;
      var tempB = b.temperature;
      var totalA = tempA.temp1 + tempA.temp2 + tempA.temp3;
      var totalB = tempB.temp1 + tempB.temp2 + tempB.temp3;
      var maxA = Math.max(tempA.temp1, tempA.temp2, tempA.temp3);
      var maxB = Math.max(tempB.temp1, tempB.temp2, tempB.temp3);

      if (maxA < maxB) {
        return 1;
      } else if (maxA > maxB) {
        return -1;
      }

      if (alertA < alertB) {
        return 1;
      } else if (alertA > alertB) {
        return -1;
      }

      if (totalA < totalB) {
        return 1;
      } else if (totalA > totalB) {
        return -1;
      }

      return 0;
    };

    return miners.sort(compareMiners);
  }

  public changeUser(): void {
    this.router.navigate(['/dashboard', this.selectedUser, this.sortBy]);
  }
}
