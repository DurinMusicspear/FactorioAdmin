import { inject } from 'aurelia-framework';
import { FactorioService } from '../factorio-service';
import { ApiClient } from '../api-client';

@inject(FactorioService, ApiClient)
export class Dashboard {

  constructor(factorioService, apiClient) {
    this.factorioService = factorioService;
    this.apiClient = apiClient;

    this.serverStarted = false;
    this.serverStarting = false;
    this.playersOnline = 0;
    this.mapTime = '';
    this.evolution = 0;

    setInterval(() => {
      this.updateServerStatus();
    }, 1000);
  }

  toggleServerState() {
    if (!this.serverStarted) {
      this.apiClient.startServer('Island.zip');
      this.serverStarted = true;
      this.serverStarting = true;
      // return true;
    } else {
      this.apiClient.stopServer();
      this.serverStarted = false;
      // return true;
    }

    return true;
  }

  updateServerStatus() {
    this.apiClient.getStatus()
      .then(res => {
        if (!res.content || !res.content.stats) {
          if (!this.serverStarting)
            this.serverStarted = false;

          return;
        }

        this.serverStarted = true;
        this.serverStarting = false;

        var status = res.content.stats;

        var index = status.playersOnline.indexOf(')');
        this.playersOnline = status.playersOnline.substr(16, index - 16);

        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var time = status.time;

        var time = status.time.split(' ');
        if (time.length > 1 && time[1].indexOf('hour') !== -1) {
          hours = time[0];
          time.splice(0, 2);
        }

        if (time.length > 1 && time[1].indexOf('minute') !== -1) {
          minutes = time[0];
          time.splice(0, 3);
        }

        if (time.length > 1 && time[1].indexOf('second') !== -1) {
          seconds = time[0];
        }

        this.mapTime = `${hours}h ${minutes}m ${seconds}s`;

        var evo = status.evolution.substr(18, 6);
        evo *= 100.0;
        this.evolution = evo.toFixed(2);
      })
      .catch(error => {
        //  if(!this.serverStarting)
        this.serverStarted = false;
        this.serverStarting = false;
      });
  }

}
