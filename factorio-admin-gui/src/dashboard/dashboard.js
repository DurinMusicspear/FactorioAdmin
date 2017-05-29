import { inject } from 'aurelia-framework';
import { FactorioService } from '../factorio-service';

@inject(FactorioService)
export class Dashboard {

  constructor(factorioService) {
    this.factorioService = factorioService;
    this.serverStarted = false;
    this.serverStarting = false;
  }

  toggleServerState() {
    if (!this.serverStarted) {
      this.factorioService.startServer();
      this.serverStarted = true;
      this.serverStarting = true;
      return true;
    } else if (!this.serverStarting) {
      this.factorioService.stopServer();
      this.serverStarted = false;
      return true;
    }

    return false;
  }

  
}
