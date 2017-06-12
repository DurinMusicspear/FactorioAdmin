//const  = require('');
var db = require('./server').db;
var uuid = require('uuid');
var Docker = require('dockerode');
var docker = new Docker({ host: 'localhost', port: 2375 });

class DockerService {

    constructor() {
        var containerId = db.get('containers[0].id').value();
        if (!!containerId) {
            this.checkContainerRunning(containerId);
        } else {
            this.createNewContainer();
        }
    }

    checkContainerRunning(containerId) {
        var container = docker.getContainer(containerId);
        container.inspect()
            .then(data => {
                if (data.State.Running !== true) {
                    container.start();
                    console.log('Starting container ' + containerId);
                }
            }).catch(error => {
                if (error.statusCode === 404) {
                    db.get('containers')
                        .remove({ id: containerId })
                        .write();
                    console.log('Container not found ' + containerId);
                    this.createNewContainer();
                }
            })
    }

    createNewContainer() {
        const name = 'factorio-' + uuid().substr(0, 8);
        docker.createContainer({
            Image: 'durinmusicspear/factorio-admin-api:0.15.19',
            HostConfig: {
                PortBindings: {
                    '34197/udp': [{ HostIp: '0.0.0.0', HostPort: '34197' }]
                }
            },
            name: name
        }).then(container => {
            return container.start();
        }).then(container => {
            return container.inspect();
        }).then(data => {
            const id = data.Id;
            db.get('containers')
                .push({ id: id, name: name })
                .write();
            console.log('New container created ' + id);
        })
        // .catch(error => {
        //     //console.log(error);
        // });
    }

}

module.exports = new DockerService();