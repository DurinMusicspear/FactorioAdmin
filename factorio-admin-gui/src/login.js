import { Aurelia, inject } from 'aurelia-framework';
// import { Redirect } from 'aurelia-router';
import { AuthService } from './auth-service';

@inject(Aurelia, AuthService)
export class App {

    constructor(aurelia, auth) {
        this.aurelia = aurelia;
        this.auth = auth;

        if(!this.auth.isAuthenticated())
            this.auth.login();
    }

}
