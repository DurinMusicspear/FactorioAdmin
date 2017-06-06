import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { AuthService } from './auth-service';

@inject(AuthService)
export class App {

  constructor(auth) {
    this.auth = auth;
  }

  configureRouter(config, router) {
    // config.title = 'Contacts';

    //config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: '', moduleId: 'dashboard/dashboard', title: 'Dashboard' },
      { route: 'server-settings', moduleId: 'server-settings/server-settings', name: 'Server settings' },
      { route: 'map-generator', moduleId: 'map-generator/map-generator', name: 'Map generator' },
      { route: 'save-files', moduleId: 'save-files/save-files', name: 'Save files' },
      { route: 'mods', moduleId: 'mods/mods', name: 'Mods' }
    ]);

    this.router = router;
  }

  logout() {
    this.auth.logout();
    location.href = '/';
  }

}

// @inject(AuthService)
// export class AuthorizeStep {
//   constructor(auth) {
//     this.auth = auth;
//   }

//   run(routingContext, next) {
//     let isLoggedIn = this.auth.isAuthenticated();
//     let loginRoute = this.auth.getLoginRoute();

//     if (routingContext.getAllInstructions().some(i => i.config.auth)) {
//       if (!isLoggedIn) {
//         this.auth.setInitialUrl(window.location.href);
//         return next.cancel(new Redirect(loginRoute));
//       }
//     } else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment === loginRoute)) {
//       let loginRedirect = this.auth.getLoginRedirect();
//       return next.cancel(new Redirect(loginRedirect));
//     }

//     return next();
//   }
// }