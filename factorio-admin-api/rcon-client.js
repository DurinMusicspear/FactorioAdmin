var spawn = require('child_process').spawn;
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Rcon = require('modern-rcon');

module.exports = function () {
    var rconClient = {};
    var rcon = null;
    var connected = false;

    rconClient.connect = function() {
        rcon = new Rcon('localhost', 'd77LPgbPfAxk');

        rcon.connect().then(() => {
            connected = true;
        }).catch(err => {
            console.log('Rcon connection refused: ', err);
        });
    }

    rconClient.stats = async (function () {

        if(!connected) {
            rconClient.connect();
            console.log('Rcon not connected');
            // return false;
        }

        try {
            var time = await (rcon.send('/time'));
            var players = await (rcon.send('/players'));
            var evolution = await (rcon.send('/evolution'));
            return { time: time, players: players, evolution: evolution};
        } catch (ex) {
            console.log(ex);
            return false;
        }
    })

    return rconClient;

}