var statsConfig = require('./stats-config.json');
var parameters = require('./parameters.json');
var http = require('http');
var fs = require('fs');

var steamApiBaseUrl = 'http://api.steampowered.com';

exports.getPlayerSummaries = (steamId) => {

	return new Promise((resolve, reject) => {

		if (false === increaseNbCurlRequest()) {
			request.on('error', (e) => {
		  		return reject(`Max curl request reached`);
			}); 
		}

		var url = steamApiBaseUrl+'/ISteamUser/GetPlayerSummaries/v0002/';
		url += '?key='+parameters.steamApiKey+'&steamids='+steamId;

		var request = http.request(url, (response) => {

			if (response.statusCode == '500') {
				return reject('Error while requesting Steam API');
			}

			var str = '';

			response.on('data', (chunk) => {
				str += chunk;
			});

			response.on('end', () => {
				return resolve(JSON.parse(str));
			})
		});

		request.on('error', (e) => {
	  		return reject(`problem with request: ${e.message}`);
		});

		request.end();
	});
};

exports.getFriendsList = (steamId) => {

	return new Promise((resolve, reject) => {

		if (false === increaseNbCurlRequest()) {
			request.on('error', (e) => {
		  		return reject(`Max curl request reached`);
			}); 
		}

		var url = steamApiBaseUrl+'/ISteamUser/GetFriendList/v0001/';
		url += '?key='+parameters.steamApiKey+'&steamid='+steamId+'&relationship=friend';

		var request = http.request(url, (response) => {

			if (response.statusCode == '500') {
				return reject('Error while requesting Steam API');
			}

			var str = '';

			response.on('data', (chunk) => {
				str += chunk;
			});

			response.on('end', () => {
				return resolve(JSON.parse(str));
			})
		});

		request.on('error', (e) => {
	  		return reject(`problem with request: ${e.message}`);
		});

		request.end();
	});
};

exports.getUserStatsForGame = (steamId) => {

	return new Promise((resolve, reject) => {

		if (false === increaseNbCurlRequest()) {
			request.on('error', (e) => {
		  		return reject(`Max curl request reached`);
			}); 
		}

		var url = steamApiBaseUrl+'/ISteamUserStats/GetUserStatsForGame/v0002/';
		url += '?appid='+statsConfig.appId+'&key='+parameters.steamApiKey+'&steamid='+steamId;

		var request = http.request(url, (response) => {

			if (response.statusCode == '500') {
				return reject('Error while requesting Steam API');
			}

			var str = '';

			response.on('data', (chunk) => {
				str += chunk;
			});
			
			response.on('end', () => {
				return resolve(JSON.parse(str));
			})
		});

		request.on('error', (e) => {
	  		return reject(`problem with request: ${e.message}`);
		});

		request.end();
	});
};

exports.getOwnedGames = (steamId) => {

	return new Promise((resolve, reject) => {

		if (false === increaseNbCurlRequest()) {
			request.on('error', (e) => {
		  		return reject(`Max curl request reached`);
			}); 
		}

		var url = steamApiBaseUrl+'/IPlayerService/GetOwnedGames/v0001/';
		url += '?key='+parameters.steamApiKey+'&steamid='+steamId+'&format=json';

		var request = http.request(url, (response) => {

			if (response.statusCode == '500') {
				return reject('Error while requesting Steam API');
			}

			var str = '';

			response.on('data', (chunk) => {
				str += chunk;
			});
			
			response.on('end', () => {
				return resolve(JSON.parse(str));
			})
		});

		request.on('error', (e) => {
	  		return reject(`problem with request: ${e.message}`);
		});

		request.end();
	});

};

function increaseNbCurlRequest() {

	return fs.readFile(parameters.nbCurlLocation, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		var nbCurlRequest = parseInt(data);

		if (nbCurlRequest > parameters.nbCurlRequestMax) {
			return false;
		} else {
			nbCurlRequest++; 

			fs.writeFile(parameters.nbCurlLocation, nbCurlRequest);
			return true;
		}
	});
}
