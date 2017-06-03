const Rcon = require('modern-rcon');

class RconClient {

    constructor() {
    }

    stats() {
        let rcon = new Rcon('localhost', 27015, 'd77LPgbPfAxk');
        return rcon.connect().then(() => {
            let result = {};
            return rcon.send('/time')
                .then(time => {
                    result.time = time;
                    return rcon.send('/players');
                })
                .then(players => {
                    result.players = players;
                    return rcon.send('/players online');
                })
                .then(playersOnline => {
                    result.playersOnline = playersOnline;
                    return rcon.send('/evolution');
                })
                .then(evo => {
                    result.evolution = evo;
                    rcon.disconnect();
                    return result;
                })
                .catch(error => {
                    console.log('Rcon send failed: ', error);
                    rcon.disconnect();
                    return false;
                });
        }).catch(err => {
            console.log('Rcon connection refused: ', err);
            return false;
        });
    }

}

module.exports = new RconClient();