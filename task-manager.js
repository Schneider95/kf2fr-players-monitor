var statsConfig = require('./stats-config.json');
var parameters = require('./parameters.json');
var databaseRequestManager = require('./database-request-manager');
var steamRequestManager = require('./steam-request-manager');
var colors = require('colors/safe');
var server = require('./server');
var io = server.io;

exports.checkIfInviteNeededForKf2FrHoe = () => {

	return databaseRequestManager.getKf2FrHoePotentialPlayer() 
		.then((player) => {
			return updatePlayer(player.steamId);
		})
		.catch((err) => {
			return err;
		});
};

exports.inviteAcceptedForKf2FrHoe = (steamId) => {

	return databaseRequestManager.inviteAcceptedForKf2FrHoe(steamId) 
		.then((steamId) => { 
			return true;
		})
		.catch((err) => {
			return err;
		});
};

exports.inviteNeededForKf2FrHoe = (steamId) => {

	return databaseRequestManager.inviteNeededForKf2FrHoe(steamId) 
		.then((steamId) => { 
			return true;
		})
		.catch((err) => {
			return err;
		});
};

exports.inviteSentForKf2Fr = (steamId) => {

	return databaseRequestManager.inviteSentForKf2Fr(steamId) 
		.then((steamId) => { 
			return true;
		})
		.catch((err) => {
			return err;
		});
};

exports.inviteSentForKf2FrHoe = (steamId) => {

	return databaseRequestManager.inviteSentForKf2FrHoe(steamId) 
		.then((steamId) => { 
			return true;
		})
		.catch((err) => {
			return err;
		});
};

var updatePlayer = (steamId) => {

	var player;

	var deletePlayerBySteamId = (steamId) => {

		return databaseRequestManager.deletePlayerBySteamId(steamId) 
			.then((response) => {
				return response;
			})
			.catch((err) => {
				return err;
			})
	};

	var getPlayerBySteamId = (steamId) => {

		console.log('---------------------------------------------------------------------------------------');
		console.log('GetPlayerBySteamId : '+steamId);

		return databaseRequestManager.getPlayerBySteamId(steamId) 
			.then((response) => {
				player = response;
				return getPlayerSummaries(steamId);
			})
			.catch((err) => {
				return err;
			})
	};

	var getPlayerSummaries = (steamId) => {

		player.steamId = steamId;

		return steamRequestManager.getPlayerSummaries(steamId) 
			.then((response) => {

				if (response.response.players[0].loccountrycode == undefined) {
					console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' n\'a pas précisé son pays')); 
			    	deletePlayerBySteamId(steamId);
			    	return {
			    		'reason': 'unknownCountry',
			    		'status': 'playerDeleted',
			    		'steamId': steamId,
			    	};
				}

				if (response.response.players[0].communityvisibilitystate != '3' ||
					((response.response.players[0].loccountrycode != 'FR' && 
					response.response.players[0].loccountrycode != 'BE')))
			    { 
			    	console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' n\'est ni français ni belge, mais '+response.response.players[0].loccountrycode)); 
			    	deletePlayerBySteamId(steamId);
			    	return {
			    		'country': response.response.players[0].loccountrycode,
			    		'reason': 'badCountry',
			    		'status': 'playerDeleted',
			    		'steamId': steamId,
			    	};
		    	}

		    	console.log(colors.green('GetPlayerSummaries : Le joueur '+ steamId + ' est '+response.response.players[0].loccountrycode)); 
				player.name = response.response.players[0].personaname;

				return getOwnedGames(steamId);
			})
			.catch((err) => {
				return err;
			})
	};

	var getOwnedGames = (steamId) => {

		return steamRequestManager.getOwnedGames(steamId) 
			.then((response) => { 
				var games = response.response.games;
				var hasGame = false;

				if (games === undefined) {
					console.log(colors.red('GetOwnedGames : Le joueur '+ steamId + ' n\'a pas le jeu '+statsConfig.appId)); 
					deletePlayerBySteamId(steamId);
					return {
			    		'reason': 'dontHaveGame',
			    		'status': 'playerDeleted',
			    		'steamId': steamId, 
			    	};
				}

				games.forEach((element) => {
					if (element.appid == statsConfig.appId) {
						hasGame = true;
						player.timePlayed = element.playtime_forever;
						player.timePlayed2LastWeeks = element.playtime_2weeks;

					    if (undefined === player.timePlayed2LastWeeks) {
					    	player.timePlayed2LastWeeks = 0;
				    	}

                        if ('0000-00-00 00:00:00' == player.lastPeriodPlayed || 0 < player.timePlayed2LastWeeks)  {
                            player.lastPeriodPlayed = new Date();
                        }
					}
				});

				if (player.timePlayed === undefined || !hasGame) { 
			    	console.log(colors.red('GetOwnedGames : Le joueur '+ steamId + ' n\'a pas le jeu '+statsConfig.appId)); 
					deletePlayerBySteamId(steamId);
					return {
			    		'reason': 'dontHaveGame',
			    		'status': 'playerDeleted',
			    		'steamId': steamId, 
			    	};
		    	}

		    	if (player.timePlayed < statsConfig.timePlayedNeededForKf2Fr) 
				{ 
			    	console.log(colors.red('GetOwnedGames : Le joueur '+ steamId + ' a le jeu '+statsConfig.appId+' mais n\'a que '+player.timePlayed/60+' heures de jeu.')); 
					deletePlayerBySteamId(steamId);
					return {
			    		'reason': 'notEnoughTimePlayed', 
			    		'status': 'playerDeleted',
			    		'steamId': steamId, 
			    		'timePlayed': player.timePlayed/60, 
			    	};
		    	}

		    	console.log(colors.green('GetOwnedGames : Le joueur '+ steamId + ' a le jeu '+statsConfig.appId+' et a '+player.timePlayed/60+' heures de jeu.')); 
				
				return getUserStatsForGame(steamId);
			})
			.catch((err) => {
				return err;
			})
	};


	var getUserStatsForGame = (steamId) => {

		return steamRequestManager.getUserStatsForGame(steamId) 
			.then((response) => {

				if (response.playerstats.achievements !== undefined) {

					player.nbHardWon = 0;
					player.nbSuicidalWon = 0;
					player.nbHoeWon = 0;
					player.nbPerksMax = 0;

					response.playerstats.achievements.forEach((element) => {
				    	if (statsConfig.achievementsHard.indexOf(element.name) != '-1') {
			    			player.nbHardWon++;
				    	}

				    	if (statsConfig.achievementsSuicidal.indexOf(element.name) != '-1') {
			    			player.nbSuicidalWon++;
				    	}

				    	if (statsConfig.achievementsHoe.indexOf(element.name) != '-1') {
			    			player.nbHoeWon++;
				    	}

				    	if (statsConfig.achievementsPerksMax.indexOf(element.name) != '-1') {
			    			player.nbPerksMax++;
				    	}
					});
				}

				return checkForInvite(steamId);
			})
			.catch((err) => {
				return err;
			})
	};


	var checkForInvite = (steamId) => {
		
		if (player.inviteNeededForKf2fr == 1) {
			console.log(colors.green('CheckForInvite : Le joueur '+ steamId + ' a déjà reçu une invitation pour Kf2Fr')); 
		} else {
			if (player.timePlayed >= statsConfig.timePlayedNeededForKf2Fr) {
				console.log(colors.green('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
				console.log(colors.green('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' mérite une invitation pour Kf2Fr.')); 
			    player.inviteNeededForKf2fr = 1;
			} else {
				console.log(colors.red('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
				console.log(colors.red('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' ne mérite pas une invitation pour Kf2Fr.')); 
			}
		}	

		if (player.inviteNeededForKf2frHoe == 1) {
			console.log(colors.green('CheckForInvite : Le joueur '+ steamId + ' a déjà reçu une invitation pour Kf2FrHoe'));
		} else {
			if (player.timePlayed >= statsConfig.timePlayedNeededForKf2FrHoe) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + 'n\'a que '+(player.timePlayed/60)+' heures de jeu.'));
			}

			if (player.nbPerksMax >= statsConfig.nbPerksMaxNeededForKf2FrHoe) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbPerksMax+' perks max.')); 
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbPerksMax+' perks max.')); 
			}

			if (player.nbHoeWon >= statsConfig.nbHoeWonNeededForKf2FrHoe) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbHoeWon+' succès HoE.'));
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbHoeWon+' succès HoE.'));
			}

			if (player.nbSuicidalWon >= statsConfig.nbSuicidalWonNeededForKf2FrHoe) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbSuicidalWon+' succès Suicidal.'));
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbSuicidalWon+' succès Suicidal.'));
			}

			if (player.nbHardWon >= statsConfig.nbHardWonNeededForKf2FrHoe) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbHardWon+' succès Hard.'));
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbHardWon+' succès Hard.'));
			}

			if (player.timePlayed >= statsConfig.timePlayedNeededForKf2FrHoe &&
				player.nbPerksMax >= statsConfig.nbPerksMaxNeededForKf2FrHoe &&
				player.nbHoeWon >= statsConfig.nbHoeWonNeededForKf2FrHoe &&
				player.nbSuicidalWon >= statsConfig.nbSuicidalWonNeededForKf2FrHoe &&
				player.nbHardWon >= statsConfig.nbHardWonNeededForKf2FrHoe
			) {
				console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' mérite une invitation pour Kf2FrHoe.')); 
				player.inviteNeededForKf2frHoe = 1;
			} else {
				console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' ne mérite pas encore une invitation pour Kf2FrHoe.')); 
			}
		}			

		return databaseRequestManager.updatePlayer(player);
	};

	return getPlayerBySteamId(steamId)
		.then((response) => {
			return response;
		})
		.catch((err) => {
			return err;
		})
};

exports.retrieveFriendsNextPlayer = () => {

	var updateLastFriendsCheck = (steamId) => {

		console.log('UpdateLastFriendsCheck : '+steamId);

		return databaseRequestManager.updateLastFriendsCheck(steamId)
			.then((response) => {
				return getFriendsList(steamId); 
			})
			.catch((err) => {
				console.log('testtest');
			})
	};

	var getFriendsList = (steamId) => {

		console.log('GetFriendsList : '+steamId);

		return steamRequestManager.getFriendsList(steamId) 
			.then((response) => {
				var friends = response.friendslist.friends; 

				return saveFriends(steamId, friends);
			})
			.catch((err) => {
				return err;
			})
	};

	var saveFriends = (steamId, friends) => {

		console.log('SaveFriends');

		friends.forEach((friend) => {

			return databaseRequestManager.getPlayerBySteamId(friend.steamid)
				.then((response) => {
					if (undefined === response) {
						return databaseRequestManager.saveNewPlayer(friend.steamid); 
		    		}
				})
				.catch((err) => {

				})
		});

		return {'steamId': steamId, 'status': 'retrieveFriends', 'friends': friends};
	};

	return databaseRequestManager.getNextPlayerToCheckFriends() 
		.then((player) => {
			return updateLastFriendsCheck(player.steamId);
		})
		.catch((err) => {
			return err;
		});
};

exports.scanPlayers = () => {
	return databaseRequestManager.getNextPlayerToCheck()
	    .then((player) => { 
	    	if (player === undefined) {
				return {'status': 'scanNoMorePlayersToScan'};
	    	} else {
	    		return updatePlayer(player.steamId);
	    	}
	    })
	    .catch((err) => {
	      	console.log(err);
	    });
};

exports.updatePlayer = updatePlayer;

exports.updateKf2FrHoePlayer = () => {

	return databaseRequestManager.getKf2FrHoePlayer() 
		.then((player) => {
			return updatePlayer(player.steamId);
		})
		.catch((err) => {
			return err;
		});
};