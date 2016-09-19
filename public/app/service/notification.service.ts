import {Injectable} from 'angular2/core';
import {Notification} from '../model/notification.interface';

@Injectable()
export class NotificationService {

    private notifications: Notification[] = [];
    
    constructor() { }
    
    add(reason, player) {
	
	var notification: Notification = {
	    reason: reason,	
	    player: player
	};
	
	this.notifications.unshift(notification);
	this.notifications.splice(10, 1);
    }
    
    getNotifications() {
	return this.notifications;
    }
}
