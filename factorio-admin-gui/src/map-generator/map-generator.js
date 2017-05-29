import { inject } from 'aurelia-framework';
import { FactorioService } from '../factorio-service';

@inject(FactorioService)
export class MapGenerator {

  constructor(factorioService) {
    this.factorioService = factorioService;
    this.saveFiles = [];
  }

  getSaveFiles() {

  }
}
