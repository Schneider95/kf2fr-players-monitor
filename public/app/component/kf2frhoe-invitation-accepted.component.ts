import { Component } from 'angular2/core';
import { HumanReadableDatePipe } from '../pipe/human-readable-date.pipe';
import { NotificationService } from '../service/notification.service';
import { Player } from '../model/player.interface';
import { PlayerService } from '../service/player.service';
import { SocketService } from '../service/socket.service';
import { TimePlayedPipe } from '../pipe/time-played.pipe';
@Component({
    pipes: [HumanReadableDatePipe, TimePlayedPipe],
    selector: 'kf2frhoe-invitation-accepted',
    templateUrl: 'views/kf2frhoe-invitation-accepted.html'
})

export class Kf2FrHoeInvitationAcceptedComponent {
    
    players: Player[] = [];
    
    constructor(
	private _playerService: PlayerService,
	private _socketService: SocketService,
	private _notificationService: NotificationService
    ) {	}
    
    ngOnInit() {
	this._playerService
	    .getKf2FrHoeInvitationAccepted()
	    .subscribe((players) => {
		this.players = players;
	    });
    }
    
    ngOnDestroy() {
	this._socketService = null;
    }
    
    deletePlayer(steamId) {
	var index = this.players.findIndex((player) => player.steamId === steamId);
	this.players.splice(index, 1);
    }
    
    updatePlayerStats(steamId) {
	var playerIndex = this.players.findIndex(player => player.steamId === steamId);
	this.players[playerIndex].updatePending = true;
	
	this._playerService
	    .updatePlayer(steamId)
	    .subscribe((response) => {
		this.players[playerIndex].updatePending = false;
		this.players[playerIndex] = response.player;
		this._notificationService.add(response.reason, response.player);
	    });
    }
}
