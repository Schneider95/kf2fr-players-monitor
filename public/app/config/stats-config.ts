import {Injectable} from 'angular2/core';

@Injectable()
export class StatsConfigService {
	public timePlayedNeededForKf2FrHoe = 18000;
	public nbPerksMaxNeeded= 6;
	public nbHoeWonNeeded = 4;
	public nbSuicidalWonNeeded = 10;
	public nbHardWonNeeded = 11;
}