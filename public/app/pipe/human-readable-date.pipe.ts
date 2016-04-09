import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'humanReadableDate' })
export class HumanReadableDatePipe implements PipeTransform {
	transform(value: string, args: string[]): any {

		var date = new Date(value);

		return this.pad(date.getDate().toString(), 2) + '/' 
			+ this.pad((date.getMonth() + 1).toString(), 2) + '/' 
		+ date.getFullYear() + ' ' 
			+ this.pad(date.getHours().toString(), 2) + ':'
			+ this.pad(date.getMinutes().toString(), 2) + ':' 
			+ this.pad(date.getSeconds().toString(), 2);
	}

	pad(value:string, length:number) {
	    return (value.toString().length < length) ? this.pad("0" + value, length) : value;
	}
}