import { HttpClient } from 'aurelia-http-client';

export class FactorioService {

    constructor() {
        this.state = 'stoped';
        this.client = new HttpClient()
            .configure(x => {
                x.withBaseUrl('http://localhost:3000/api');
                //x.withHeader('Authorization', 'bearer 123');
            });
    }

    startServer() {
        var self = this;
        this.client.get('start/Test.zip')
            .then(function (result) {
                console.log(result);
                self.state = 'running';
            });
    }

}
