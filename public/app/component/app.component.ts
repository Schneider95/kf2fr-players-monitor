import {Component, OnInit} from 'angular2/core';
import {HTTP_BINDINGS} from 'angular2/http';
import {Kf2FrInvitationNeededComponent} from './kf2fr-invitation-needed.component';
import {Kf2FrHoePotentialPlayersComponent} from './kf2frhoe-potential-players.component';
import {Kf2FrHoeInvitationNeededComponent} from './kf2frhoe-invitation-needed.component';
import {Kf2FrHoeInvitationSentComponent} from './kf2frhoe-invitation-sent.component';
import {Kf2FrHoeInvitationAcceptedComponent} from './kf2frhoe-invitation-accepted.component';
import {Notification} from '../model/notification.interface';
import {NotificationService} from '../service/notification.service';
import {ParametersService} from '../config/parameters'; 
import {PlayerService} from '../service/player.service';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {ScanComponent} from './scan.component';
import {SocketService} from '../service/socket.service';
import {StatsConfigService} from '../config/stats-config'; 

@Component({
  selector: 'main',
  templateUrl: 'views/main.html',
  directives: [ROUTER_DIRECTIVES], 
  providers: [
    ROUTER_PROVIDERS, 
    HTTP_BINDINGS,
    NotificationService,
    ParametersService, 
    PlayerService,
    SocketService,
    StatsConfigService
  ]
})

@RouteConfig([
    {
      path: '/scan',
      name: 'Scan',
      component: ScanComponent,
      useAsDefault: true
    },
    {
      path: '/kf2FrInviteNeeded',
      name: 'Kf2FrInviteNeeded',
      component: Kf2FrInvitationNeededComponent
    },
    {
      path: '/kf2FrHoePotentialPlayers',
      name: 'Kf2FrHoePotentialPlayers',
      component: Kf2FrHoePotentialPlayersComponent
    },
    {
      path: '/kf2FrHoeInviteNeeded',
      name: 'Kf2FrHoeInviteNeeded',
      component: Kf2FrHoeInvitationNeededComponent
    },
    {
      path: '/kf2FrHoeInviteSent',
      name: 'Kf2FrHoeInviteSent',
      component: Kf2FrHoeInvitationSentComponent
    },
    {
      path: '/kf2FrHoeInviteAccepted',
      name: 'Kf2FrHoeInviteAccepted',
      component: Kf2FrHoeInvitationAcceptedComponent
    },

])

export class AppComponent implements OnInit {

  constructor(
    private _notificationService: NotificationService,
    private _playerService: PlayerService,
    private _socketService: SocketService
   ) { }

  ngOnInit() {

    this._socketService.io.on('playerDeleted', (data) => {
      this._notificationService.add('playerDeleted', data);
    });

    this._socketService.io.on('scanPlayerFriendsRetrieved', (data) => {
      this._notificationService.add('scanPlayerFriendsRetrieved', data);
    });

    this._socketService.io.on('scanPlayerNeedInviteForKf2Fr', (data) => {
      this._notificationService.add('scanPlayerNeedInviteForKf2Fr', data);
    });

    this._socketService.io.on('scanPlayerNeedInviteForKf2FrHoe', (data) => {
      this._notificationService.add('scanPlayerNeedInviteForKf2FrHoe', data);
    });

    this._socketService.io.on('updateKf2FrHoePlayer', (data) => {
      this._notificationService.add('updateKf2FrHoePlayer', data);
    });

    this._socketService.io.on('inviteNeededForKf2FrHoe', (data) => {
      this._notificationService.add('inviteNeededForKf2FrHoe', data);
    });

    this._socketService.io.on('inviteNotNeededForKf2FrHoe', (data) => {
      this._notificationService.add('inviteNotNeededForKf2FrHoe', data);
    });
  }

  getNotifications() {
    return this._notificationService.getNotifications();
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/