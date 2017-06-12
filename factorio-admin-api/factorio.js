var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

var savePath = process.env.SAVE_FOLDER || '/factorio/saves';
var configPath = process.env.CONFIG_FOLDER || '/factorio/config';
var executablePath = process.env.CONFIG_FOLDER || '/opt/factorio/bin/x64';

module.exports = function () {
    var factorio = {};
    var serverProcess = null;

    factorio.generateMap = function (fileName) {
        fileName = fileName + '.zip';
        var filePath = path.join(savePath, fileName);

        if (fs.existsSync(filePath)) {
            console.log('Savefile already exist: ' + fileName);
            return false;
        }

        if (serverProcess !== null) {
            console.log('Factorio process already running');
            return false;
        }

        var args = [
            "--create",
            filePath,
            "--map-settings",
            path.join(configPath, "map-settings.json"),
            "--map-gen-settings",
            path.join(configPath, "map-gen-settings.json"),
        ];

        var proc = factorioProcess(args);
    }

    factorio.startServer = function (fileName) {
        fileName = fileName + '.zip';
        var filePath = path.join(savePath, fileName);

        if (!fs.existsSync(filePath)) {
            console.log('Savefile does not exist: ' + fileName);
            return false;
        }

        if (serverProcess !== null) {
            console.log('Factorio process already running');
            return false;
        }

        var args = [
            "--start-server",
            filePath,
            "--server-settings",
            path.join(configPath, "server-settings.json"),
            //"--port", "",
            "--rcon-port", "27015",
            "--rcon-password", "d77LPgbPfAxk"
            //"--console-log", "console.txt"
        ];

        serverProcess = factorioProcess(args);
        console.log('Factorio process started!');
        return serverProcess;
    }

    factorio.stopServer = function () {
        if (serverProcess !== null)
            serverProcess.kill();

        console.log('Factorio process stoped!');
        serverProcess = null;
    }

    return factorio;
};

function factorioProcess(args) {
    var factorioPath = executablePath;
    var proc = spawn(path.join(factorioPath, 'factorio'), args, { shell: false });

    proc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    proc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    proc.on('error', (err) => {
        console.log('Failed to start factorio process:', err);
    });

    return proc;
}