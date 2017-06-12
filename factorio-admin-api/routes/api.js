var express = require('express');
var fs = require('fs');
var path = require('path');

var savePath = process.env.SAVE_FOLDER || '/factorio/saves';
var configPath = process.env.CONFIG_FOLDER || '/factorio/config';

module.exports = function (factorio, rconClient) {
  var router = express.Router();

  router.get('/generate-map/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    factorio.generateMap(fileName);
    res.json({ result: 'Map generated' });
  });

  router.get('/start/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    factorio.startServer(fileName);
    res.json({ result: 'Server started' });
  });

  router.get('/stop', function (req, res, next) {
    factorio.stopServer();
    res.json({ result: 'Server stoped' });
  });

  router.get('/server-settings', function (req, res, next) {
    var serverSettings = fs.readFileSync(path.join(configPath, 'server-settings.json'));
    res.json(JSON.parse(serverSettings));
  });

  router.post('/server-settings', function (req, res, next) {
    var serverSettings = JSON.stringify(req.body);
    fs.writeFileSync(path.join(configPath, 'server-settings.json'), serverSettings);
    res.status(200).end();
  });

  router.get('/map-gen-settings', function (req, res, next) {
    var serverSettings = fs.readFileSync(path.join(configPath, 'map-gen-settings.json'));
    res.json(JSON.parse(serverSettings));
  });

  router.post('/map-gen-settings', function (req, res, next) {
    var mapGenSettings = JSON.stringify(req.body);
    fs.writeFileSync(path.join(configPath, 'map-gen-settings.json'), mapGenSettings);
    res.status(200).end();
  });

  router.get('/map-settings', function (req, res, next) {
    var serverSettings = fs.readFileSync(path.join(configPath, 'map-settings.json'));
    res.json(JSON.parse(serverSettings));
  });

  router.post('/map-settings', function (req, res, next) {
    var mapSettings = JSON.stringify(req.body);
    fs.writeFileSync(path.join(configPath, 'map-settings.json'), mapSettings);
    res.status(200).end();
  });

  router.get('/save-files', function (req, res, next) {
    var saves = [];
    fs.readdirSync(savePath).forEach(file => {
      file = file.replace('.zip', '');
      saves.push(file);
    });
    res.json({ saves: saves });
  });

  router.delete('/save-file/:fileName', function (req, res, next) {
    var fileName = req.params.fileName;
    res.json({ success: true });
  });

  router.put('/rename-save-file/:fileName/:newName', function (req, res, next) {
    var fileName = req.params.fileName;
    var newName = req.params.newName;
    res.json({ success: true });
  });

  router.get('/server-stats', (req, res, next) => {
    rconClient.stats().then(stats => {
      res.json({ stats: stats });
    });
  });

  return router;

};
