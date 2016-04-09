
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {ParametersService} from '../config/parameters'; 
import {Player} from '../model/player.interface';


@Injectable()
export class PlayerService {
	public http: Http;
	public parameters: ParametersService;


	constructor(public _http: Http, public _parameters: ParametersService) {
		this.http = _http;
		this.parameters = _parameters;
	}

	getKf2FrHoeInvitationNeeded() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getKf2FrHoeInvitationNeeded';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	getKf2FrHoeInvitationAccepted() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getKf2FrHoeInvitationAccepted';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}
	
	getKf2FrHoeInvitationSent() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getKf2FrHoeInvitationSent';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}
	

	getPlayersToScan() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getPlayersToScan';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});

	}

	getPlayersKf2FrInvitationNeeded() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getKf2FrInvitationNeeded';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}
	
	getPlayersKf2FrHoePotentialPlayers() {

		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/getKf2FrHoePotentialPlayers';

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	inviteAcceptedForKf2FrHoe(player) {
		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/inviteAcceptedForKf2FrHoe/' + player.steamId;

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	inviteNeededForKf2FrHoe(player) {
		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/inviteNeededForKf2FrHoe/' + player.steamId;

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	inviteSentForKf2Fr(player) {
		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/inviteSentForKf2Fr/' + player.steamId;

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	inviteSentForKf2FrHoe(player) {
		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/inviteSentForKf2FrHoe/' + player.steamId;

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}

	updatePlayer(steamId) {
		var url = this.parameters.baseUrl + ':' + this.parameters.port + '/api/updatePlayer/' + steamId;

		return this.http
			.get(url)
			.map((response) => {
				return response.json();
			});
	}
}