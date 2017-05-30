import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@inject(Aurelia, HttpClient)
export class AuthService {

    constructor(aurelia, http) {
        // var lockOptions = {
        //   oidcConformant: true,
        //   autoClose: true,
        //   /* Any other params */
        //   auth: {
        //     params: {
        //       audience: ['http://localhost:9000', 'qLiuvNGbX2UlX4BShUxzS9HyuTr8oQVV']
        //     }
        //   }
        // }
        //const options = { auth: { redirect: true }, autoclose: false };
        this.lock = new Auth0Lock('qLiuvNGbX2UlX4BShUxzS9HyuTr8oQVV', 'johanbjorn.eu.auth0.com');
        this.authenticated = false;

        //this.http = http;
        var self = this;

        var token = localStorage.getItem('id_token');
        if(token) {
            this.authenticated = true;
        }

        this.lock.on("authenticated", authResult => {
            // localStorage.setItem('access_token', authResult.accessToken);
            // self.authenticated = true;
            // self.lock.hide();

            self.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error) {
                    // Handle error
                    console.log(error);
                    return;
                }

                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                self.authenticated = true;
                //self.lock.hide();
                aurelia.setRoot('app');
            });
        });

        this.lock.on('unrecoverable_error', error => {
            console.log(error);
        });

        this.lock.on('authorization_error', error => {
            console.log(error);
        });
    }

    login() {
        this.lock.show();
    }

    logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        this.authenticated = false;
    }

    isAuthenticated() {
        return this.authenticated;
    }

    getAccessToken() {
        //var token = localStorage.getItem('id_token');
        return localStorage.getItem('id_token');
    }

}
