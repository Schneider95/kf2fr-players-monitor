import {Injectable} from 'angular2/core';

@Injectable()
export class StatsConfigService {
	public timePlayedNeededForKf2FrHoe = 13200;
	public nbPerksMaxNeeded= 5;
	public nbHoeWonNeeded = 3;
	public nbSuicidalWonNeeded = 7;
	public nbHardWonNeeded = 8;
}