import { Component } from 'angular2/core';
import { HumanReadableDatePipe } from '../pipe/human-readable-date.pipe';
import { NotificationService } from '../service/notification.service';
import { ParametersService } from '../config/parameters'; 
import { Player } from '../model/player.interface';
import { PlayerService } from '../service/player.service';
import { SocketService } from '../service/socket.service';
import { StatsConfigService } from '../config/stats-config'; 
import { TimePlayedPipe } from '../pipe/time-played.pipe';

@Component({
	pipes: [TimePlayedPipe, HumanReadableDatePipe],
	selector: 'kf2frhoe-potential-players',
	templateUrl: 'views/kf2frhoe-potential-players.html'
})

export class Kf2FrHoePotentialPlayersComponent {

	public players: Player[] = [];
	public timePlayedNeededForKf2FrHoe: number;
	public nbPerksMaxNeeded: number;
	public nbHoeWonNeeded: number;
	public nbSuicidalWonNeeded: number;
	public nbHardWonNeeded: number;

	constructor(
		private _playerService: PlayerService,
		private _socketService: SocketService,
		private _notificationService: NotificationService,
		private _statsConfigService: StatsConfigService
	) {
		this.timePlayedNeededForKf2FrHoe = this._statsConfigService.timePlayedNeededForKf2FrHoe;
		this.nbPerksMaxNeeded = this._statsConfigService.nbPerksMaxNeeded;
		this.nbHoeWonNeeded = this._statsConfigService.nbHoeWonNeeded;
		this.nbSuicidalWonNeeded = this._statsConfigService.nbSuicidalWonNeeded;
		this.nbHardWonNeeded = this._statsConfigService.nbHardWonNeeded;
	}

	inviteNeededForKf2FrHoe(player) {

		var playerIndex = this.players.findIndex(playerInList => playerInList.steamId === player.steamId);
		this.players.splice(playerIndex, 1);
	}

	inviteNotNeededForKf2FrHoe(player) {

		var playerIndex = this.players.findIndex(playerInList => playerInList.steamId === player.steamId);

		this.players[playerIndex].updatePending = true;
		this.players[playerIndex] = player;
		this.players[playerIndex].updatePending = false;
	}

	ngOnInit() {
		this._playerService.getPlayersKf2FrHoePotentialPlayers().subscribe(
			players => this.players = players
		);

		this._socketService.io.on('inviteNeededForKf2FrHoe', (player) => {
			this.inviteNeededForKf2FrHoe(player);
		});

		this._socketService.io.on('inviteNotNeededForKf2FrHoe', (player) => {
			this.inviteNotNeededForKf2FrHoe(player);
		});
	}

	ngOnDestroy() {
		this._socketService = null;
	}
	
	updatePlayerStats(steamId) {
		var playerIndex = this.players.findIndex(player => player.steamId === steamId);

		this.players[playerIndex].updatePending = true;

		this._playerService
			.updatePlayer(steamId)
			.subscribe((player) => {
				if (player.needInviteForKf2frHoe) {
					this._notificationService.add('inviteNeededForKf2FrHoe', player);
					this.inviteNeededForKf2FrHoe(player);
				} else {
					this._notificationService.add('inviteNotNeededForKf2FrHoe', player);
					this.inviteNotNeededForKf2FrHoe(player);
				}
			});
	}
}