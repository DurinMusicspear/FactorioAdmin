import { inject, observable } from 'aurelia-framework';
import { ApiClient } from '../api-client';
import { DeepObserver } from '../deep-observer';

@inject(ApiClient, DeepObserver)
export class ServerSettings {
  @observable tags;
  @observable admins;

  constructor(apiClient, deepObserver) {
    this.client = apiClient;
    this.settings = null;
    this.settingsSub = deepObserver.observe(this, 'settings', this.serverSettingsChanged.bind(this));
    this.getServerSettings();
  }

  getServerSettings() {
    this.client.getServerSettings()
      .then(res => {
        if (res.content) {
          this.settings = res.content;

          if (Array.isArray(this.settings.tags))
            this.tags = this.settings.tags.join(',');

          if (Array.isArray(this.settings.admins))
            this.admins = this.settings.admins.join(',');
        }
      })
  }

  serverSettingsChanged(newValue, oldValue, property) {
    console.log(property, oldValue, newValue);

    if (oldValue === newValue)
      return;

    this.saveServerSettings();
  }

  tagsChanged(newValue, oldValue) {
    this.settings.tags = newValue.split(',').map(o => { return o });
  }

  adminsChanged(newValue, oldValue) {
    this.settings.admins = newValue.split(',').map(o => { return o });
  }

  saveServerSettings() {
    this.client.saveServerSettings(this.settings)
      .then(res => {
        
      })
  }
}
