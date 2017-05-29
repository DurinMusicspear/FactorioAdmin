export class App {

  configureRouter(config, router) {
    // config.title = 'Contacts';
    config.map([
      { route: '', moduleId: 'dashboard/dashboard', title: 'Dashboard' },
      { route: 'server-settings', moduleId: 'server-settings/server-settings', name: 'Server settings' },
      { route: 'map-generator', moduleId: 'map-generator/map-generator', name: 'Map generator' },
      { route: 'save-files', moduleId: 'save-files/save-files', name: 'Save files' },
      { route: 'mods', moduleId: 'mods/mods', name: 'Mods' }
    ]);

    this.router = router;
  }

}
