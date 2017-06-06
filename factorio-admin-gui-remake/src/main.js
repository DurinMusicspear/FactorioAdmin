import environment from './environment';
import { AuthService } from './auth-service';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-animator-css');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  // if (environment.testing) {
  //   aurelia.use.plugin('aurelia-testing');
  // }

  var auth = aurelia.container.get(AuthService);

  aurelia.start()
    .then(a => {
      if (auth.isAuthenticated()) {
        a.setRoot('app');
      } else {
        a.setRoot('login');
      }
    });
}
