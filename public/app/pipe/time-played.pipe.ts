import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'timePlayed' })
export class TimePlayedPipe implements PipeTransform {
	transform(value: number, args: string[]): any {

		if (undefined === value) {
			return 0;
		} else {
			return Math.floor(value / 60);
		}
	}
}