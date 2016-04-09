import { Component } from 'angular2/core';
import { HumanReadableDatePipe } from '../pipe/human-readable-date.pipe';
import { NotificationService } from '../service/notification.service';
import { Player } from '../model/player.interface';
import { PlayerService } from '../service/player.service';
import { SocketService } from '../service/socket.service';
import { TimePlayedPipe } from '../pipe/time-played.pipe';

@Component({
	pipes: [HumanReadableDatePipe, TimePlayedPipe],
	selector: 'kf2frhoe-invitation-needed',
	templateUrl: 'views/kf2fr-invitation-needed.html'
})

export class Kf2FrInvitationNeededComponent {

	players: Player[] = [];

	constructor(
		private _playerService: PlayerService,
		private _socketService: SocketService,
		private _notificationService: NotificationService
	) { }

	ngOnInit() {
		this._playerService.getPlayersKf2FrInvitationNeeded().subscribe(
			players => this.players = players
		);

		this._socketService.io.on('scanPlayerNeedInviteForKf2Fr', (player) => {
			this.players.push(player);
		});
	}

	inviteSentForKf2Fr(steamId) {

		var playerIndex = this.players.findIndex(player => player.steamId === steamId);

		this.players[playerIndex].updatePending = true;

		this._playerService
			.inviteSentForKf2Fr(this.players[playerIndex])
			.subscribe((player) => {
				this.players[playerIndex].updatePending = false;
				this._notificationService.add('inviteSentForKf2Fr', this.players[playerIndex]);
				this.players.splice(playerIndex, 1);
			});
	}
}
