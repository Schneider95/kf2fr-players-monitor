import {Injectable} from 'angular2/core';
import {ParametersService} from '../config/parameters'; 

declare var io;

@Injectable()
export class SocketService {

	public io;
	public test;

	constructor(private _parametersService: ParametersService) {
		this.test = 'test';
		this.io = io(this._parametersService.baseUrl + ':' + this._parametersService.port);
	}
}