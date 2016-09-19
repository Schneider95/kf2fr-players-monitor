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
      });
  };
  
  var getPlayerSummaries = (steamId) => {
    
    player.steamId = steamId;
    
    return steamRequestManager.getPlayerSummaries(steamId) 
      .then((response) => {
        player.name = response.response.players[0].personaname;
	
	if (response.response.players[0].communityvisibilitystate != '3') {
	  
	  if (player.inviteAcceptedForKf2FrHoe === 1) {
	    console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' est deja dans le groupe Kf2FrHoe, mais a passé son profil en privé.')); 
	    return checkForInvite(player.steamId);
	  } else {
    	    console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' a un profil privé.')); 
	    
	    return {
	      'reason': 'privateProfile',
	      'playerToDelete': true,
	      'player': player,
	    };
	  }
	}
	
	if (response.response.players[0].loccountrycode == undefined && player.inviteAcceptedForKf2FrHoe === 0) {
	  console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' n\'a pas précisé son pays')); 
	  return {
	    'reason': 'unknownCountry',
	    'playerToDelete': true,
	    'player': player,
	  };
	}
	
	if (response.response.players[0].loccountrycode != 'FR' &&
	    response.response.players[0].loccountrycode != 'BE' &&
	    player.inviteAcceptedForKf2FrHoe === 0)
	{
	  player.country = response.response.players[0].loccountrycode;
	  console.log(colors.red('GetPlayerSummaries : Le joueur '+ steamId + ' n\'est ni français ni belge, mais '+player.country));
	  return {
	    'reason': 'badCountry',
	    'playerToDelete': true,
	    'player': player,
	  };
	}
	
	console.log(colors.green('GetPlayerSummaries : Le joueur '+ steamId + ' est '+response.response.players[0].loccountrycode)); 
	
	return getOwnedGames(steamId);
      })
      .catch((err) => {
	return err;
      });
  };
  
  var getOwnedGames = (steamId) => {
    
    return steamRequestManager.getOwnedGames(steamId) 
      .then((response) => { 
	var games = response.response.games;
	var hasGame = false;
	
	if (games === undefined) {
	  console.log(colors.red('GetOwnedGames : Le joueur '+ steamId + ' n\'a pas le jeu '+statsConfig.appId)); 
	  
	  return {
	    'reason': 'dontHaveGame',
	    'playerToDelete': true,
	    'player': player, 
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
	  return {
	    'reason': 'dontHaveGame',
	    'playerToDelete': true,
	    'player': player, 
	  };
	}
	
	if (player.timePlayed < statsConfig.timePlayedNeededForKf2Fr) 
	{ 
	  console.log(colors.red('GetOwnedGames : Le joueur '+ steamId + ' a le jeu '+statsConfig.appId+' mais n\'a que '+player.timePlayed/60+' heures de jeu.')); 
	  return {
	    'reason': 'notEnoughTimePlayed', 
	    'playerToDelete': true,
	    'player': player,
	  };
	}
	
	console.log(colors.green('GetOwnedGames : Le joueur '+ steamId + ' a le jeu '+statsConfig.appId+' et a '+player.timePlayed/60+' heures de jeu.')); 
	
	return getUserStatsForGame(steamId);
      })
      .catch((err) => {
	return err;
      });
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
      });
  };
  
  var checkForInvite = (steamId) => {

    var message = {};
    
    if (player.inviteNeededForKf2Fr === 1) {
      console.log(colors.green('CheckForInvite : Le joueur '+ steamId + ' a déjà reçu une invitation pour Kf2Fr'));
      message = {'reason': 'inviteAlreadySentForKf2Fr', 'player': player};
    } else {
      if (player.timePlayed >= statsConfig.timePlayedNeededForKf2Fr) {
	console.log(colors.green('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
	console.log(colors.green('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' mérite une invitation pour Kf2Fr.')); 
	player.inviteNeededForKf2Fr = 1;
        message = {'reason': 'inviteNeededForKf2Fr', 'player': player};
      } else {
	console.log(colors.red('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
	console.log(colors.red('CheckForInviteForKf2Fr : Le joueur '+ steamId + ' ne mérite pas une invitation pour Kf2Fr.')); 
    	message = {'reason': 'inviteNotNeededForKf2Fr', 'player': player};
      }
    }	
    
    if (player.inviteAcceptedForKf2FrHoe === 1) {
      console.log(colors.green('CheckForInvite : Le joueur '+ player.steamId + ' a déjà reçu une invitation pour Kf2FrHoe'));
      message = {'reason': 'inviteAlreadyAcceptedForKf2FrHoe', 'player': player};
    } else {
      if (player.timePlayed >= statsConfig.timePlayedNeededForKf2FrHoe) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+(player.timePlayed/60)+' heures de jeu.'));
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + 'n\'a que '+(player.timePlayed/60)+' heures de jeu.'));
	message = {'reason': 'notEnoughTimePlayedForKf2FrHoe', 'player': player};
      }
      
      if (player.nbPerksMax >= statsConfig.nbPerksMaxNeededForKf2FrHoe) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbPerksMax+' perks max.')); 
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbPerksMax+' perks max.')); 
	message = {'reason': 'notEnoughPerksMaxForKf2FrHoe', 'player': player};
      }
      
      if (player.nbHardWon >= statsConfig.nbHardWonNeededForKf2FrHoe) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbHardWon+' succès Hard.'));
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbHardWon+' succès Hard.'));
	message = {'reason': 'notEnoughHardForKf2FrHoe', 'player': player};
      }
      
      if (player.nbSuicidalWon >= statsConfig.nbSuicidalWonNeededForKf2FrHoe) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbSuicidalWon+' succès Suicidal.'));
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbSuicidalWon+' succès Suicidal.'));
	message = {'reason': 'notEnoughSuicidalForKf2FrHoe', 'player': player};
      }

      if (player.nbHoeWon >= statsConfig.nbHoeWonNeededForKf2FrHoe) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' a '+player.nbHoeWon+' succès HoE.'));
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' n\'a que '+player.nbHoeWon+' succès HoE.'));
	message = {'reason': 'notEnoughHoeForKf2FrHoe', 'player': player};
      }
      
      if (player.timePlayed >= statsConfig.timePlayedNeededForKf2FrHoe &&
	  player.nbPerksMax >= statsConfig.nbPerksMaxNeededForKf2FrHoe &&
	  player.nbHoeWon >= statsConfig.nbHoeWonNeededForKf2FrHoe &&
	  player.nbSuicidalWon >= statsConfig.nbSuicidalWonNeededForKf2FrHoe &&
	  player.nbHardWon >= statsConfig.nbHardWonNeededForKf2FrHoe
	 ) {
	console.log(colors.green('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' mérite une invitation pour Kf2FrHoe.')); 
	player.inviteNeededForKf2FrHoe = 1;
    	message = {'reason': 'inviteNeededForKf2FrHoe', 'player': player};
      } else {
	console.log(colors.red('CheckForInviteForKf2FrHoe : Le joueur '+ steamId + ' ne mérite pas encore une invitation pour Kf2FrHoe.')); 
      }
    }			
    
    return databaseRequestManager.updatePlayer(player)
      .then((response2) => {
	console.log('updatePlayer');
	console.log(message);
	return message;
      })
      .catch((err) => {
	return err;
      });
  };
  
  return getPlayerBySteamId(steamId)
    .then((response) => {
      if (response.playerToDelete) {
        return databaseRequestManager.deletePlayerBySteamId(response.player) 
	  .then((response2) => {
	    return response;
	  })
	  .catch((err) => {
	    return err;
	  });
      } else {
        return databaseRequestManager.updatePlayer(response.player)
	  .then((response2) => {
	    return response;
	  })
	  .catch((err) => {
	    return err;
	  });
      }
    })
    .catch((err) => {
      return err;
    });
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
      });
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
	  
	});
    });
    
    return {'steamId': steamId, 'reason': 'retrieveFriends', 'friends': friends};
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
	return undefined;
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

