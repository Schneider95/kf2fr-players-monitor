import {Injectable} from 'angular2/core';

@Injectable()
export class StatsConfigService {
	public timePlayedNeededForKf2FrHoe = 21000;
	public nbPerksMaxNeeded= 6;
	public nbHoeWonNeeded = 5;
	public nbSuicidalWonNeeded = 11;
	public nbHardWonNeeded = 12;
}