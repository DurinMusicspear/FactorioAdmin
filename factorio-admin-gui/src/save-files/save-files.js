import { inject } from 'aurelia-framework';
import { FactorioService } from '../factorio-service';
import { HttpClient } from 'aurelia-http-client';
import { AuthService } from '../auth-service';

@inject(FactorioService, HttpClient, AuthService)
export class SaveFiles {

  constructor(factorioService, http, auth) {
    this.factorioService = factorioService;
    http.configure(x => {
        x.withBaseUrl('http://localhost:3000/');
        x.withHeader('Authorization', 'Bearer ' + auth.getAccessToken());
      });
    this.http = http;
    this.saveFiles = [];
    //this.files = [];
  }

  getSaveFiles() {

  }

  uploadFiles(files) {
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.http
      .post('upload-save-files', formData)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }
}
