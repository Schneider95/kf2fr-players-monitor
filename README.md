### Installation

Create parameters.json :
{
    "databaseAddress": "",
    "databaseName": "",
    "databaseUser":  "",
    "databasePassword": "",

    "port": 3000,

    "nbCurlLocation": "nb_curl.txt",
    "nbCurlRequestMax": "99000",

    "steamApiKey": "steamApiKey - must be secret",

    "checkIfInviteNeededForKf2FrHoe": "30 0 * * * *",
    "updateKf2FrHoePlayer": "15 0 * * * *",
    "scanPlayers": "0 * * * * *"
}

Create public/app/config/parameters.ts :
import {Injectable} from 'angular2/core';

@Injectable()
export class ParametersService {
  public baseUrl = 'http://X.X.X.X';
  public port = 8888;
}

Create database : 

CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `steamId` varchar(255) NOT NULL,
  `lastCheck` datetime NOT NULL,
  `lastFriendsCheck` datetime NOT NULL,
  `timePlayed` int(11) NOT NULL,
  `timePlayed2LastWeeks` int(11) NOT NULL,
  `lastPeriodPlayed` datetime NOT NULL,
  `nbPerksMax` tinyint(4) NOT NULL,
  `nbHoeWon` int(11) NOT NULL,
  `nbSuicidalWon` int(11) NOT NULL,
  `nbHardWon` int(11) NOT NULL,
  `inviteNeededForKf2fr` tinyint(1) NOT NULL,
  `inviteSentForKf2fr` tinyint(4) NOT NULL,
  `inviteNeededForKf2frHoe` tinyint(4) NOT NULL,
  `inviteSentForKf2frHoe` tinyint(4) NOT NULL,
  `inviteAcceptedForKf2frHoe` tinyint(4) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

Create nb_curl file :
touch nb_curl.txt

Compile TS with :
gulp

Launch server with :
forever start server.js

List forever task with :
forever list

Stop forever task with :
forever stop 0