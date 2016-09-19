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
	.then((response) => {
	  io.sockets.emit('notification', response);
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
	.then((response) => {
	  io.sockets.emit('notification', response);
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
	  if (undefined === response) {
	    retrieveFriendsNextPlayer();
	  } else {
	    io.sockets.emit('notification', response);
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
	io.sockets.emit('notification', response);
      })
      .catch((err) => {
	console.log(err);
      });
  };

  checkIfInviteNeededForKf2FrHoe.start();
  updateKf2FrHoePlayer.start();
  scanPlayers.start();
};

