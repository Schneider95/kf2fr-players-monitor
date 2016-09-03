var databaseRequestManager = require('./database-request-manager');
var taskManager = require('./task-manager');
var fs = require('fs');

exports.index = function (req, res) {
  	res.sendFile(__dirname + '/public/index.html');
};

exports.exportPlayersKf2FrHoe = (request, response) => {
	databaseRequestManager.getKf2FrHoeInvitationAccepted()  // Returns a Promise!
	.then((players) => {

		var today = new Date();

	        var textExport = '[h1]Mise a jour le '+today.getDate()+'/'+("0" + (today.getMonth() + 1)).slice(-2)+'/'+today.getFullYear()+'[/h1]\n\n';

		textExport += '[table]\n';
		textExport += '[tr]\n';
		textExport += '\t[th][b]Nom[/b][/th]\n';
		textExport += '\t[th][b]Temps de jeu[/b][/th]\n';
		textExport += '\t[th][b]Perks 25[/b][/th]\n';
		textExport += '\t[th][b]HoE[/b][/th]\n';
		textExport += '\t[th][b]Suicidal[/b][/th]\n';
		textExport += '\t[th][b]Hard[/b][/th]\n';
		textExport += '[/tr]\n';

		players.forEach((player) => {
			textExport += '[tr]\n';
			textExport += '\t[td][url=http://steamcommunity.com/profiles/'+player.steamId+']' + player.name + '[/url][/td]\n';
			textExport += '\t[td]' + Math.floor(player.timePlayed / 60) +'h[/td]\n';
			textExport += '\t[td]' + player.nbPerksMax +'[/td]\n';
			textExport += '\t[td]' + player.nbHoeWon +'[/td]\n';
			textExport += '\t[td]' + player.nbSuicidalWon +'[/td]\n';
			textExport += '\t[td]' + player.nbHardWon +'[/td]\n';
			textExport += '[/tr]\n';
		});

		textExport += '[/table]'

		response.setHeader('Content-disposition', 'attachment; filename=playersKf2FrHoe.html');
		response.setHeader('Content-type', 'text/plain');
		response.charset = 'UTF-8';
		response.write(textExport);
		response.end();

	})
	.catch((err) => {
		response.status(500).send('Something broken!');
	})
};

exports.getPlayersToScan = (request, response) => {
	databaseRequestManager.getPlayersToScan()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};


exports.getKf2FrInvitationNeeded = (request, response) => {
	databaseRequestManager.getKf2FrInvitationNeeded()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};

exports.getKf2FrHoePotentialPlayers = (request, response) => {
	databaseRequestManager.getKf2FrHoePotentialPlayers()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};

exports.getKf2FrHoeInvitationNeeded = (request, response) => {
	databaseRequestManager.getKf2FrHoeInvitationNeeded()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};

exports.getKf2FrHoeInvitationSent = (request, response) => {
	databaseRequestManager.getKf2FrHoeInvitationSent()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};


exports.getKf2FrHoeInvitationAccepted = (request, response) => {
	databaseRequestManager.getKf2FrHoeInvitationAccepted()  // Returns a Promise!
	.then((players) => {
		response.send(players);
	})
	.catch((err) => {
		res.status(500).send('Something broken!');
	})
};

exports.inviteSentForKf2Fr = (request, response) => {
	taskManager.inviteSentForKf2Fr(request.params.steamId)
	.then((player) => { 
		response.json(player);
	})
	.catch((err) => {
		response.status(500).send(err);
	});
};

exports.inviteNeededForKf2FrHoe = (request, response) => {
	taskManager.inviteNeededForKf2FrHoe(request.params.steamId)
	.then((player) => { 
		response.json(player);
	})
	.catch((err) => {
		response.status(500).send(err);
	});
};

exports.inviteSentForKf2FrHoe = (request, response) => {
	taskManager.inviteSentForKf2FrHoe(request.params.steamId)
	.then((player) => { 
		response.json(player);
	})
	.catch((err) => {
		response.status(500).send(err);
	});
};

exports.inviteAcceptedForKf2FrHoe = (request, response) => {
	taskManager.inviteAcceptedForKf2FrHoe(request.params.steamId)
	.then((player) => { 
		response.json(player);
	})
	.catch((err) => {
		response.status(500).send(err);
	});
};

exports.updatePlayer = (request, response) => {
	taskManager.updatePlayer(request.params.steamId)
	.then((player) => { 
		response.json(player);
	})
	.catch((err) => {
		response.status(500).send(err);
	});
};
