import {Player} from '../model/player.interface';

export interface Notification {
    player: Player;
    reason: string;
}
