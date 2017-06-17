var express = require('express');
var router = express.Router();
var dockerService = require('../docker-service');

/* GET home page. */
router.post('/create-server', function (req, res, next) {
    var serverSettings = req.body;
    dockerService.createServer(serverSettings)
        .then(containerInfo => {
            res.json({ message: 'Server created', data: containerInfo, success: true });
        })
        .catch(error => {
            res.json({ message: 'Failed to create server', data: error, success: false });
        });
});

router.get('/servers', function (req, res, next) {
    var servers = dockerService.getServers();
    res.json({ message: '', data: servers, success: true });
        // .then(servers => {
        //     res.json({ message: '', data: server, success: true });
        // })
        // .catch(error => {
        //     res.json({ message: 'Failed to get server list', data: error, success: false });
        // });
});

router.get('/start-server/:containerId', function (req, res, next) {
    var containerId = req.params.containerId;
    dockerService.startServer(containerId)
        .then(result => {
            res.json({ message: 'Server started', data: result, success: true });
        })
        .catch(error => {
            res.json({ message: 'Failed to start server', data: error, success: false });
        });
});

module.exports = router;
