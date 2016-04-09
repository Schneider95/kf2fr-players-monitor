var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var parameters = require('./parameters.json');
exports.io = io;


var routes = require('./routes');
var cronManager = require('./cron-manager');

server.listen(parameters.port, function () {
  console.log('Example app listening on port '+parameters.port);
});

app.use('/libs', express.static(__dirname + '/public/libs'));
app.use('/', express.static(__dirname + '/public'));

app.get('/api/getPlayersToScan', routes.getPlayersToScan);
app.get('/api/getKf2FrInvitationNeeded', routes.getKf2FrInvitationNeeded);
app.get('/api/getKf2FrHoePotentialPlayers', routes.getKf2FrHoePotentialPlayers);
app.get('/api/getKf2FrHoeInvitationNeeded', routes.getKf2FrHoeInvitationNeeded);
app.get('/api/getKf2FrHoeInvitationSent', routes.getKf2FrHoeInvitationSent);
app.get('/api/getKf2FrHoeInvitationAccepted', routes.getKf2FrHoeInvitationAccepted);
app.get('/api/inviteSentForKf2Fr/:steamId', routes.inviteSentForKf2Fr);
app.get('/api/inviteNeededForKf2FrHoe/:steamId', routes.inviteNeededForKf2FrHoe);
app.get('/api/inviteSentForKf2FrHoe/:steamId', routes.inviteSentForKf2FrHoe);
app.get('/api/inviteAcceptedForKf2FrHoe/:steamId', routes.inviteAcceptedForKf2FrHoe);
app.get('/api/updatePlayer/:steamId', routes.updatePlayer);
app.get('/exportPlayersKf2FrHoe', routes.exportPlayersKf2FrHoe);
app.get('*', routes.index);

cronManager.init();

