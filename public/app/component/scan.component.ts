import { Component } from 'angular2/core';
import { HumanReadableDatePipe } from '../pipe/human-readable-date.pipe';
import { NotificationService } from '../service/notification.service';
import { Player } from '../model/player.interface';
import { PlayerService } from '../service/player.service';
import { SocketService } from '../service/socket.service';
import { TimePlayedPipe } from '../pipe/time-played.pipe';

@Component({
	pipes: [HumanReadableDatePipe, TimePlayedPipe],
	selector: 'scan',
	templateUrl: 'views/scan.html'
})

export class ScanComponent {

	players: Player[] = [];

	constructor(
		private _playerService: PlayerService,
		private _socketService: SocketService,
		private _notificationService: NotificationService
	) { 

	}

	ngOnInit() {

		this._playerService.getPlayersToScan().subscribe(
			players => this.players = players
		);

		this._socketService.io.on('playerDeleted', (data) => {
			this.deletePlayer(data.steamId);
		});

		this._socketService.io.on('scanPlayerFriendsRetrieved', (data) => {
			data.friends.forEach((player) => {
				this.players.push({ 'steamId': player.steamid });
			});
		});

		this._socketService.io.on('scanPlayerNeedInviteForKf2Fr', (data) => {
			this.deletePlayer(data.steamId);
		});

		this._socketService.io.on('scanPlayerNeedInviteForKf2FrHoe', (data) => {
			this.deletePlayer(data.steamId);
		});
	}

	ngOnDestroy() {
		this._socketService = null;
	}

	public deletePlayer(steamId) {
		var index = this.players.findIndex((player) => player.steamId === steamId);
		this.players.splice(index, 1);
	}
}