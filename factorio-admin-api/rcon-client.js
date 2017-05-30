var spawn = require('child_process').spawn;
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Rcon = require('modern-rcon');

module.exports = function () {
    var rconClient = {};
    rconClient.rcon = null;
    rconClient.connected = false;
    rconClient.connecting = false;

    rconClient.connect = function() {
        this.rcon = new Rcon('localhost', 'd77LPgbPfAxk');
        this.connecting = true;

        this.rcon.connect().then(() => {
            this.connected = true;
            this.connecting = false;
        }).catch(err => {
            console.log('Rcon connection refused: ', err);
            this.connected = false;
            this.connecting = false;
        });
    }

    rconClient.connect = function() {
        if(this.rcon) {
            this.rcon.disconnect();
            this.rcon = null;
        }
        this.connected = false;
        this.connecting = false;
    }

    rconClient.stats = async (function () {

        if(!rconClient.connected && !rconClient.connecting) {
            rconClient.connect();
            console.log('Rcon not connected');
            return false;
        }

        try {
            var time = await (rcon.send('/time'));
            var players = await (rcon.send('/players'));
            var playersOnline = await (rcon.send('/players online'));
            var evolution = await (rcon.send('/evolution'));
            return { time: time, players: players, playersOnline: playersOnline, evolution: evolution};
        } catch (ex) {
            console.log(ex);

            if(!rconClient.connecting)
                rconClient.disconnect();

            return false;
        }
    })

    return rconClient;

}