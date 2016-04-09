export interface Player {
	id?: number;
  	steamId: string;
  	name?: string;
	lastCheck?: Date,
	lastFriendsCheck?: Date, 
	timePlayed?: number, 
	nbPerksMax?: number, 
	nbHoeWon?: number, 
	nbSuicidalWon?: number, 
	nbHardWon?: number, 
	needInviteForKf2fr?: number, // on set a 1 quand l'invite a kf2 frdoit etre envoyé
	inviteSentForKf2fr?: number, // on set a 1 quand l'invite a kf2 fr a ete envoyé
	needInviteForKf2frHoe?: number, // on set a 1 quand l'invite a kf2 fr hoe doit etre envoyé
	inviteSentForKf2frHoe?: number, // on set a 1 quand l'invite a kf2 fr hoe a ete envoyé
	inviteAcceptedForKf2frHoe?: number, // on set a 1 quand l'invite a kf2 fr hoe a ete accepté
	updatePending?: boolean, // on set a true quand on met le joueur à jour
}