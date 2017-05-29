import { HttpClient } from 'aurelia-http-client';

export class ApiClient {

    constructor() {
        this.client = new HttpClient()
            .configure(x => {
                x.withBaseUrl('http://localhost:3000/api');
                //x.withHeader('Authorization', 'bearer 123');
            });
    }

    startServer(fileName) {
        return this.client.get('start/' + fileName);
    }

    stopServer() {
        return this.client.get('start');
    }

    getServerSettings() {
        return this.client.get('server-settings');
    }

    saveServerSettings(serverSettings) {
        return this.client.post('server-settings', serverSettings);
    }

    getSaveFiles() {
        return this.client.get('save-files');
    }

    getMapSettings() {
        return this.client.get('map-settings');
    }

    getMapGenSettings() {
        return this.client.get('map-gen-settings');
    }
}