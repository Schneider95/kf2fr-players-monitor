var statsConfig = require('./stats-config.json');
var parameters = require('./parameters.json');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : parameters.databaseAddress,
    user     : parameters.databaseUser,
    password : parameters.databasePassword,
	database : parameters.databaseName,
});


exports.deletePlayerBySteamId = (steamId) => {
	var query = "DELETE FROM players ";
	query += "WHERE steamId = '"+steamId+"' ";

    return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if (err) {
				return reject(err);
			}

			return resolve({'steamId': steamId, 'status':'playerDeleted'});
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

exports.getKf2FrHoeInvitationNeeded = () => {

	var query = "SELECT * FROM players ";
	query += "WHERE inviteNeededForKf2frHoe = '1' ";
	query += "AND inviteSentForKf2frHoe = '0' ";
	query += "AND inviteAcceptedForKf2frHoe = '0' ";
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

exports.getKf2FrHoeInvitationSent = () => {

	var query = "SELECT * FROM players ";
	query += "WHERE inviteNeededForKf2frHoe = '1' ";
	query += "AND inviteSentForKf2frHoe = '1' ";
	query += "AND inviteAcceptedForKf2frHoe = '0' ";
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

	var query = "SELECT *, ";
	query += "( ";
	query += "(CASE WHEN timePlayed >= '"+statsConfig.timePlayedNeededForKf2FrHoe+"' THEN 1 ELSE 0 END)+ ";
	query += "(CASE WHEN nbPerksMax >= '"+statsConfig.nbPerksMaxNeededForKf2FrHoe+"' THEN 1 ELSE 0 END)+ ";
	query += "(CASE WHEN nbHoeWon >= '"+statsConfig.nbHoeWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END)+ ";
	query += "(CASE WHEN nbSuicidalWon >= '"+statsConfig.nbSuicidalWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END)+ ";
	query += "(CASE WHEN nbHardWon >= '"+statsConfig.nbHardWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) ";
	query += ") as conditionReached, ";

	query += "(CASE WHEN timePlayed >= '"+statsConfig.timePlayedNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) as conditionTime, ";
	query += "(CASE WHEN nbPerksMax >= '"+statsConfig.nbPerksMaxNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) as conditionPerk, ";
	query += "(CASE WHEN nbHoeWon >= '"+statsConfig.nbHoeWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) as conditionHoe, ";
	query += "(CASE WHEN nbSuicidalWon >= '"+statsConfig.nbSuicidalWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) as conditionSuicidal, ";
	query += "(CASE WHEN nbHardWon >= '"+statsConfig.nbHardWonNeededForKf2FrHoe+"' THEN 1 ELSE 0 END) as conditionHard ";
	query += "FROM players ";
	query += "WHERE inviteNeededForKf2frHoe = '0' ";
	query += "AND (timePlayed >= '"+statsConfig.timePlayedNeededForKf2FrHoe+"' ";
	query += "OR nbPerksMax >= '"+statsConfig.nbPerksMaxNeededForKf2FrHoe+"' ";
	query += "OR nbHoeWon >= '"+statsConfig.nbHoeWonNeededForKf2FrHoe+"' ";
	query += "OR nbSuicidalWon >= '"+statsConfig.nbSuicidalWonNeededForKf2FrHoe+"' ";
	query += "OR nbHardWon >= '"+statsConfig.nbHardWonNeededForKf2FrHoe+"') ";
	query += "ORDER BY conditionReached DESC, timePlayed DESC, nbPerksMax DESC, nbHoeWon DESC, nbSuicidalWon DESC, nbHardWon DESC  ";
	query += "LIMIT 100 ";

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
	player.lastCheck = dateNow;

	var query = "UPDATE players SET ";
	query += "name = '"+player.name.replace(/'/g, "\\'")+"', ";
	query += "lastCheck = '"+player.lastCheck.toISOString().slice(0, 19).replace('T', ' ')+"', ";
	query += "timePlayed = '"+player.timePlayed+"', ";
	query += "nbPerksMax = '"+player.nbPerksMax+"', ";
	query += "nbHoeWon = '"+player.nbHoeWon+"', ";
	query += "nbSuicidalWon = '"+player.nbSuicidalWon+"', ";
	query += "nbHardWon = '"+player.nbHardWon+"', ";
	query += "inviteNeededForKf2fr = '"+player.inviteNeededForKf2fr+"', ";
	query += "inviteSentForKf2fr = '"+player.inviteSentForKf2fr+"', ";
	query += "inviteNeededForKf2frHoe = '"+player.inviteNeededForKf2frHoe+"', ";
	query += "inviteSentForKf2frHoe = '"+player.inviteSentForKf2frHoe+"', ";
	query += "inviteAcceptedForKf2frHoe = '"+player.inviteAcceptedForKf2frHoe+"' ";
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

