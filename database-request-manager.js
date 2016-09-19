
var statsConfig = require('./stats-config.json');
var parameters = require('./parameters.json');

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : parameters.databaseAddress,
  user     : parameters.databaseUser,
  password : parameters.databasePassword,
  database : parameters.databaseName,
});

exports.deletePlayerBySteamId = (player) => {
  var query = "DELETE FROM players ";
  query += "WHERE steamId = '"+player.steamId+"' ";

  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(player);
    });
  });
};

exports.getNextPlayerToCheck = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE lastCheck = '0000:00:00 00-00-00' ";
  query += "ORDER BY timePlayed DESC LIMIT 1";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.getNextPlayerToCheckFriends = () => {
  var query = "SELECT * FROM players ";
  query += "ORDER BY lastFriendsCheck ASC LIMIT 1";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.getPlayerBySteamId = (steamId) => {
  var query = "SELECT * FROM players ";
  query += "WHERE steamId = '"+steamId+"' ";

  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.getPlayersToScan = () => {
  var query = "SELECT * FROM players WHERE lastCheck = '0000-00-00 00:00:00' ";
  query += "ORDER BY timePlayed DESC, nbPerksMax DESC, nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};

exports.getKf2FrInvitationNeeded = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE inviteNeededForKf2fr = '1' ";
  query += "AND inviteSentForKf2fr = '0' ";
  query += "ORDER BY nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC, timePlayed DESC, nbPerksMax DESC";
  
  return new Promise((resolve, reject) => {  
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};

exports.getKf2FrHoeInvitationNeeded = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE inviteNeededForKf2frHoe = '1' ";
  query += "AND inviteSentForKf2frHoe = '0' ";
  query += "AND inviteAcceptedForKf2frHoe = '0' ";
  query += "ORDER BY nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC, timePlayed DESC, nbPerksMax DESC";
  
  return new Promise((resolve, reject) => {
    
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};

exports.getKf2FrHoeInvitationSent = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE inviteNeededForKf2frHoe = '1' ";
  query += "AND inviteSentForKf2frHoe = '1' ";
  query += "AND inviteAcceptedForKf2frHoe = '0' ";
  query += "ORDER BY nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC, nbPerksMax DESC, timePlayed DESC";
  
  return new Promise((resolve, reject) => {
    
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};

exports.getKf2FrHoeInvitationAccepted = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE inviteNeededForKf2frHoe = '1' ";
  query += "AND inviteSentForKf2frHoe = '1' ";
  query += "AND inviteAcceptedForKf2frHoe = '1' ";
  query += "ORDER BY timePlayed DESC, nbPerksMax DESC, nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC";
  
  return new Promise((resolve, reject) => {
    
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};


var getKf2FrHoePotentialPlayersQuery = () => {
  var query ="SELECT *, ";
  query += "@ratioTimePlayed := (timePlayed / '"+statsConfig.timePlayedNeededForKf2FrHoe+"'), ";
  query += "@ratioNbPerksMax := (nbPerksMax / '"+statsConfig.nbPerksMaxNeededForKf2FrHoe+"'), ";
  query += "@ratioHoe := (nbHoeWon / '"+statsConfig.nbHoeWonNeededForKf2FrHoe+"'), ";
  query += "@ratioSuicidal := (nbSuicidalWon / '"+statsConfig.nbSuicidalWonNeededForKf2FrHoe+"'), ";
  query += "@ratioHard := (nbHardWon / '"+statsConfig.nbHardWonNeededForKf2FrHoe+"'), ";
  query += "@scoreTimePlayed := (CASE WHEN (SELECT @ratioTimePlayed) > 1 THEN 1 ELSE (SELECT @ratioTimePlayed) END), ";
  query += "@scoreNbPerksMax := (CASE WHEN (SELECT @ratioNbPerksMax) > 1 THEN 1 ELSE (SELECT @ratioNbPerksMax) END), ";
  query += "@scoreHoe := (CASE WHEN (SELECT @ratioHoe) > 1 THEN 1 ELSE (SELECT @ratioHoe) END), ";
  query += "@scoreSuicidal := (CASE WHEN (SELECT @ratioSuicidal) > 1 THEN 1 ELSE (SELECT @ratioSuicidal) END), ";
  query += "@scoreHard := (CASE WHEN (SELECT @ratioHard) > 1 THEN 1 ELSE (SELECT @ratioHard) END), ";
  query += "((SELECT @scoreTimePlayed) + (SELECT @scoreNbPerksMax) + (SELECT @scoreHoe) + (SELECT @scoreSuicidal) + (SELECT @scoreHard)) as score ";
  query += "FROM players ";
  query += "WHERE inviteNeededForKf2frHoe = '0' ";
  query += "AND timePlayed > 6000 "
  query += "ORDER BY score DESC, nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC, nbPerksMax DESC, timePlayed DESC ";
  query += "LIMIT 500 ";

  return query;
};

exports.getKf2FrHoePotentialPlayer = () => {
  var query = 'SELECT * FROM (';
  var subQuery = getKf2FrHoePotentialPlayersQuery();
  query += subQuery;
  query += ') as players ORDER BY lastCheck ASC LIMIT 1';
  
  return new Promise((resolve, reject) => {
    
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.getKf2FrHoePotentialPlayers = () => {
  var query = getKf2FrHoePotentialPlayersQuery();

  return new Promise((resolve, reject) => {  
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result);
    });
  });
};

exports.getKf2FrHoePlayer = () => {
  var query = "SELECT * FROM players ";
  query += "WHERE inviteAcceptedForKf2frHoe = '1' ";
  query += "ORDER BY lastCheck ASC LIMIT 1";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.inviteSentForKf2Fr = (steamId) => {
  var dateNow = new Date();
  
  var query = "UPDATE players SET ";
  query += "inviteSentForKf2fr = '1', ";
  query += "lastCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdatedPlayer : '+steamId);
      return resolve(steamId);
    });
  });
};


exports.inviteSentForKf2FrHoe = (steamId) => {
  var dateNow = new Date();
  
  var query = "UPDATE players SET ";
  query += "inviteSentForKf2frHoe = '1', ";
  query += "lastCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdatedPlayer : '+steamId);
      return resolve(steamId);
    });
  });
};

exports.inviteNeededForKf2Fr = (steamId) => {
  var dateNow = new Date();
  
  var query = "UPDATE players SET ";
  query += "inviteNeededForKf2fr = '1', ";
  query += "lastCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";
  
  return new Promise((resolve, reject) => {   
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdatedPlayer : '+steamId);
      return resolve(steamId);
    });
  });
};

exports.inviteNeededForKf2FrHoe = (steamId) => {
  var dateNow = new Date();
  
  var query = "UPDATE players SET ";
  query += "inviteNeededForKf2FrHoe = '1', ";
  query += "lastCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";

  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		

      console.log('UpdatedPlayer : '+steamId);
      return resolve(steamId);
    });
  });
};

exports.inviteAcceptedForKf2FrHoe = (steamId) => {

  var dateNow = new Date();

  var query = "UPDATE players SET ";
  query += "inviteAcceptedForKf2FrHoe = '1', ";
  query += "lastCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdatedPlayer : '+steamId);
      return resolve(steamId);
    });
  });
};

exports.saveNewPlayer = (steamId) => {
  var query = "INSERT INTO players (steamId) VALUES ('"+steamId+"')";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }
      
      return resolve(result[0]);
    });
  });
};

exports.updatePlayer = (player) => {
  
  var dateNow = new Date();
  
  player.lastCheck = new Date(); 
  
  var query = "UPDATE players SET ";
  query += "name = '"+player.name.replace(/'/g, "\\'")+"', ";
  query += "lastCheck = '"+player.lastCheck.getFullYear()+'-'+("0" + (player.lastCheck.getMonth() + 1)).slice(-2)+'-'+("0" + (player.lastCheck.getDate())).slice(-2)+' '+player.lastCheck.getHours()+':'+player.lastCheck.getMinutes()+':'+player.lastCheck.getSeconds()+"', ";
  query += "timePlayed = '"+player.timePlayed+"', ";
  
  if ('0000-00-00 00:00:00' !== player.lastPeriodPlayed) {
    query += "lastPeriodPlayed = '"+player.lastPeriodPlayed.getFullYear()+'-'+("0" + (player.lastPeriodPlayed.getMonth() + 1)).slice(-2)+'-'+("0" + (player.lastPeriodPlayed.getDate())).slice(-2)+' '+player.lastPeriodPlayed.getHours()+':'+player.lastPeriodPlayed.getMinutes()+':'+player.lastPeriodPlayed.getSeconds()+"', ";
  }
  
  query += "timePlayed2LastWeeks = '"+player.timePlayed2LastWeeks+"', ";
  query += "nbPerksMax = '"+player.nbPerksMax+"', ";
  query += "nbHoeWon = '"+player.nbHoeWon+"', ";
  query += "nbSuicidalWon = '"+player.nbSuicidalWon+"', ";
  query += "nbHardWon = '"+player.nbHardWon+"', ";
  query += "inviteNeededForKf2Fr = '"+player.inviteNeededForKf2Fr+"', ";
  query += "inviteSentForKf2Fr = '"+player.inviteSentForKf2Fr+"', ";
  query += "inviteNeededForKf2FrHoe = '"+player.inviteNeededForKf2FrHoe+"', ";
  query += "inviteSentForKf2FrHoe = '"+player.inviteSentForKf2FrHoe+"', ";
  query += "inviteAcceptedForKf2FrHoe = '"+player.inviteAcceptedForKf2FrHoe+"' ";
  query += "WHERE steamId = '"+player.steamId+"' ";
  query += "LIMIT 1";
  
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdatedPlayer : '+player.steamId);
      return resolve(player);
    });
  });
};

exports.updateLastFriendsCheck = (steamId) => {
  var dateNow = new Date();
  var query = "UPDATE players SET ";
  query += "lastFriendsCheck = '"+dateNow.toISOString().slice(0, 19).replace('T', ' ')+"' ";
  query += "WHERE steamId = '"+steamId+"' ";
  query += "LIMIT 1";
  
  return new Promise((resolve, reject) => {
    
    connection.query(query, (err, result) => {
      if (err) {
	return reject(err);
      }		
      
      console.log('UpdateLastFriendsCheck : '+steamId);
      return resolve(steamId);
    });
  });
};

