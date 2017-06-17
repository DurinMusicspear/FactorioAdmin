//const  = require('');
var db = require('./server').db;
var uuid = require('uuid');
var fs = require('fs');
var path = require('path');
var Docker = require('dockerode');

var docker = null;
if (fs.existsSync('/var/run/docker.sock'))
    docker = new Docker({ socketPath: '/var/run/docker.sock' });
else
    docker = new Docker({ host: 'localhost', port: 2375 });

class DockerService {

    constructor() {

    }

    createServer(serverSettings) {
        var id = uuid();
        var serverInfo = {
            id: id,
            container: {
                id: null,
                name: 'factorio-server-' + id.substr(0, 8),
                port: 34197,
                rconPort: 27015
            },
            version: serverSettings.version,
            saveFile: serverSettings.saveFile,
            created: Date.now(),
            lastStarted: null,
            state: 'stopped',
            timePlayed: '0h 0m 0s',
            players: [],
            playersOnline: []
        }

        return new Promise((resolve, reject) => {
            const containerfolder = path.join(__dirname, 'containers/' + serverInfo.id);
            console.log(containerfolder);
            fs.mkdirSync(containerfolder);
            resolve();
        }).then(() => {
            return docker.pull('durinmusicspear/factorio-admin-api:' + serverInfo.version);
        }).then(() => {
            return this.createContainer(serverInfo);
        }).then(container => {
            // container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
            //     stream.pipe(process.stdout);
            // });
            return container.inspect();
        }).then(data => {
            serverInfo.container.id = data.Id;
            db.get('servers')
                .push(serverInfo)
                .write();
            console.log('Server created', serverInfo);
        }).then(() => {
            return serverInfo;
        }).catch(error => {
            console.log(error);
            throw error;
        });
    }

    createContainer(serverInfo) {
        const containerSharedFolder = path.posix.join(process.env.DATA_FOLDER, 'containers/' + serverInfo.id);
        console.log(containerSharedFolder);

        return docker.createContainer({
            Image: 'durinmusicspear/factorio-admin-api:' + serverInfo.version,
            HostConfig: {
                PortBindings: {
                    '34197/udp': [{ HostIp: '0.0.0.0', HostPort: '' + serverInfo.container.port }],
                    '27015/tcp': [{ HostIp: '0.0.0.0', HostPort: '' + serverInfo.container.rconPort }]
                    //'80/tcp': [{ HostIp: '0.0.0.0', HostPort: '3000' }]
                },
                Mounts: [
                    {
                        Target: '/factorio',
                        Source: containerSharedFolder,
                        Type: 'bind'
                    }
                ],
            },
            Env: [
                'SAVE_FILE=' + serverInfo.saveFile
            ],
            name: serverInfo.container.name
        });
    }

    getServers() {
        return db.get('servers').value();
    }

    startServer(containerId) {
        var container = docker.getContainer(containerId);
        return container.inspect()
            .then(data => {
                if (data.State.Running !== true) {
                    console.log('Starting container ' + containerId);
                    container.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
                        stream.pipe(process.stdout);
                    });

                    return container.start()
                        .then(container => {
                            console.log('Containter started ' + containerId);
                            return true;
                        })
                        .catch(error => {
                            console.log('Failed to start container ' + containerId);
                            throw error;
                        })
                }
                console.log('Container already running ' + containerId);
                return true;
            }).catch(error => {
                if (error.statusCode === 404) {
                    console.log('Container not found ' + containerId);
                }
                throw error;
            });
    }

    stopServer(containerId) {
        var container = docker.getContainer(containerId);
        return container.stop()
            .catch(error => {
                console.log('Failed to stop container' + containerId, error);
                throw error;
            });
    }

    // checkContainerRunning(containerId) {
    //     var container = docker.getContainer(containerId);
    //     container.inspect()
    //         .then(data => {
    //             if (data.State.Running !== true) {
    //                 container.start();
    //                 console.log('Starting container ' + containerId);
    //             }
    //         }).catch(error => {
    //             if (error.statusCode === 404) {
    //                 db.get('containers')
    //                     .remove({ id: containerId })
    //                     .write();
    //                 console.log('Container not found ' + containerId);
    //                 this.createNewContainer();
    //             }
    //         })
    // }

    // createNewContainer() {
    //     const name = 'factorio-' + uuid().substr(0, 8);
    //     docker.createContainer({
    //         Image: 'durinmusicspear/factorio-admin-api:0.15.20',
    //         HostConfig: {
    //             PortBindings: {
    //                 '34197/udp': [{ HostIp: '0.0.0.0', HostPort: '34197' }],
    //                 '80/tcp': [{ HostIp: '0.0.0.0', HostPort: '3000' }]
    //             },
    //             Mounts: [
    //                 {
    //                     Target: '/factorio',
    //                     Source: '/C/Users/durin/AppData/Roaming/Factorio',
    //                     Type: 'bind'
    //                 }
    //             ],
    //         },
    //         Env: [
    //             "SAVE_FILE=Test"
    //         ],
    //         name: name
    //     }).then(container => {
    //         container.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
    //             stream.pipe(process.stdout);
    //         });

    //         return container.start();
    //     }).then(container => {
    //         return container.inspect();
    //     }).then(data => {
    //         const id = data.Id;
    //         db.get('containers')
    //             .push({ id: id, name: name })
    //             .write();
    //         console.log('New container created ' + id);
    //     })
    //     // .catch(error => {
    //     //     //console.log(error);
    //     // });
    // }

}

module.exports = new DockerService();