import {Injectable} from 'angular2/core';
import {Notification} from '../model/notification.interface';

@Injectable()
export class NotificationService {

	private notifications: Notification[] = [];
	/*private successNotifications: Array<string> = [
		'scanPlayerFriendsRetrieved',
		'scanPlayerNeedInviteForKf2Fr',
		'scanPlayerNeedInviteForKf2FrHoe',
		'inviteSentForKf2Fr',
		'inviteNeededForKf2FrHoe',
		'inviteSentForKf2FrHoe',
		'inviteAcceptedForKf2FrHoe'
	]

	private failNotifications: Array<string> = [
		'playerDeleted',
		'inviteNotNeededForKf2FrHoe',
	];

	private updateNotifications: Array<string> = [	
		'updateKf2FrHoePlayer'
	];*/

	constructor() { }

	add(type, data) {
		data.type = type;

/*		if (this.successNotifications.indexOf(data.type) != -1) {
			data.isSuccess = true;
		} else if (this.failNotifications.indexOf(data.type) != -1) {
		       console.log('fail');
data.isFail = true;
		} else if (this.updateNotifications.indexOf(data.type) != -1) {
			data.isUpdate = true;
		}
*/
		this.notifications.unshift(data);
		this.notifications.splice(10, 1);
	}

	getNotifications() {
		return this.notifications;
	}
}