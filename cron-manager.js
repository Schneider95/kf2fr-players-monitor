var cronJob = require('cron').CronJob;
var taskManager = require('./task-manager');
var colors = require('colors/safe');
var parameters = require('./parameters.json');
var server = require('./server');
var io = server.io;

exports.init = () => {

	var checkIfInviteNeededForKf2FrHoe = new cronJob({
	  cronTime: parameters.checkIfInviteNeededForKf2FrHoe, // une fois par heure
	  onTick: function() {
	    taskManager.checkIfInviteNeededForKf2FrHoe()
	    .then((player) => { 
	      console.log('Mise a jour reussie du joueur a surveiller : ' + player.name);
	      if (player.needInviteForKf2frHoe) {
	      	io.sockets.emit('inviteNeededForKf2FrHoe', player);
	        console.log(colors.green(player.name + ' est ADMISSIBLE dans le groupe Kf2FrHoe.'));
	      } else {
	      	io.sockets.emit('inviteNotNeededForKf2FrHoe', player);
	        console.log(colors.red(player.name + ' N\'est PAS admissible dans le groupe Kf2FrHoe.'));
	      }
	    })
	    .catch((err) => {
	      console.log(err);
	    });
	  },
	  start: false,
	  timeZone: 'Europe/Paris'
	});


	var updateKf2FrHoePlayer = new cronJob({
	  cronTime: parameters.updateKf2FrHoePlayer, // a une heure du matin
	  onTick: function() {
	    taskManager.updateKf2FrHoePlayer()
	    .then((player) => { 
	      console.log('Mise a jour reussie du joueur de Kf2FrHoe : ' + player.name);
	      io.sockets.emit('updateKf2FrHoePlayer', player);
	    })
	    .catch((err) => {
	      console.log(err);
	    });
	  },
	  start: false,
	  timeZone: 'Europe/Paris'
	});

	var scanPlayers = new cronJob({
	  cronTime: parameters.scanPlayers, // chaque minute
	  onTick: function() {
	    taskManager.scanPlayers()
	    .then((response) => {
	      if (response.status == 'scanNoMorePlayersToScan') {
      		retrieveFriendsNextPlayer();
	      } else {
		      if (response.status == 'playerDeleted') {
			  	io.sockets.emit('scanPlayerDeleted', response);
		      } 

		      if (response.inviteNeededForKf2fr == 1) {
		      	io.sockets.emit('scanPlayerNeedInviteForKf2Fr', {
		      	  'steamId': response.steamId,
			      'status': 'scanPlayerNeedInviteForKf2Fr',
		      	});
		      }

		      if (response.inviteNeededForKf2frHoe == 1) {
		      	io.sockets.emit('scanPlayerNeedInviteForKf2FrHoe', {
		      	  'steamId': response.steamId,
			      'status': 'scanPlayerNeedInviteForKf2Fr',
		      	});
		      }
	      }
	    })
	    .catch((err) => {
	      console.log(err);
	    });
	  },
	  start: false,
	  timeZone: 'Europe/Paris'
	});

	var retrieveFriendsNextPlayer = function() { 
	  return taskManager.retrieveFriendsNextPlayer()
	  .then((response) => {
		console.log(colors.green('Les amis du joueur '+ response.steamId +' ont été récupérés.'));
      	io.sockets.emit('scanPlayerFriendsRetrieved', {
      	  'friends': response.friends,
      	  'steamId': response.steamId,
	      'status': 'scanPlayerFriendsRetrieved',
      	});
	  })
	  .catch((err) => {
	    console.log(err);
	  });
	};

	checkIfInviteNeededForKf2FrHoe.start();
	updateKf2FrHoePlayer.start();
	scanPlayers.start();
};

