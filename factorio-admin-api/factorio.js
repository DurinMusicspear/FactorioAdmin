var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

module.exports = function () {
    var factorio = {};
    var serverProcess = null;

    factorio.generateMap = function (fileName) {
        fileName = fileName + '.zip';
        var filePath = path.join(process.env.SAVE_FOLDER, fileName);

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
            path.join(process.env.CONFIG_FOLDER, "map-settings.json"),
            "--map-gen-settings",
            path.join(process.env.CONFIG_FOLDER, "map-gen-settings.json"),
        ];

        var proc = factorioProcess(args);
    }

    factorio.startServer = function (fileName) {
        fileName = fileName + '.zip';
        var filePath = path.join(process.env.SAVE_FOLDER, fileName);

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
            path.join(process.env.CONFIG_FOLDER, "server-settings.json"),
            //"--port", "",
            "--rcon-port", "25575",
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
    var factorioPath = process.env.EXECUTABLE_FOLDER;
    var proc = spawn(path.join(factorioPath, 'factorio'), args, { shell: false });

    proc.stdout.on('data', (data) => {
        console.log(data);
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