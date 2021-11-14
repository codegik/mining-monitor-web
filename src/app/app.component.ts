import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'lk-app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent implements OnInit {

  date: Date;

  constructor(public appService: AppService,
    private translate: TranslateService,
    private router: Router) {
    // Change your page title here
    appService.getState().topnavTitle = 'Loading';
    translate.setDefaultLang(appService.getState().defaultLang);
    this.date = new Date();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnInit() {
    this.onResize();
    let body = document.getElementsByTagName('body')[0];
    body.className = 'dark';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
  }

  toggleFullscreen() {
    $(document).toggleFullScreen();
  }
}
