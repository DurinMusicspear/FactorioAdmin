import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { ApiClient } from './api-client';

@inject(ApiClient)
export class FactorioService {

    constructor(apiClient) {
        this.apiClient = apiClient;
        this.state = 'stoped';
    }

    startServer() {
        this.apiClient.startServer()
            .then(function (result) {
                console.log(result);
                self.state = 'running';
            });
    }

}
