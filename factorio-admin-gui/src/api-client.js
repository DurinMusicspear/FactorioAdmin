import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { AuthService } from './auth-service';

@inject(AuthService)
export class ApiClient {

    constructor(auth) {
        this.auth = auth;
        this.client = new HttpClient()
            .configure(x => {
                x.withBaseUrl('http://localhost:3000/api');
                x.withHeader('Authorization', 'Bearer ' + this.auth.getAccessToken());
            });
    }

    startServer(fileName) {
        return this.client.get('start/' + fileName);
    }

    stopServer() {
        return this.client.get('stop');
    }

    getServerSettings() {
        return this.client.get('server-settings');
    }

    saveServerSettings(serverSettings) {
        return this.client.post('server-settings', serverSettings);
    }

    getSaveFiles() {
        return this.client.get('save-files')
            .then(res => {
                return res.content.saves;
            });
    }

    getMapSettings() {
        return this.client.get('map-settings')
            .then(res => {
                return res.content;
            });
    }

    saveMapSettings(settings) {
        return this.client.post('map-settings', settings);
    }

    getMapGenSettings() {
        return this.client.get('map-gen-settings')
            .then(res => {
                return res.content;
            });
    }

    saveMapGenSettings(settings) {
        return this.client.post('map-gen-settings', settings);
    }

    getStatus() {
        return this.client.get('server-stats');
    }
    
    generateMap(fileName) {
        return this.client.get('generate-map/' + fileName);
    }
}