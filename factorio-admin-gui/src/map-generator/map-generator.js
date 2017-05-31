import { inject, observable } from 'aurelia-framework';
import { ApiClient } from '../api-client';
import { DeepObserver } from '../deep-observer';

@inject(ApiClient, DeepObserver)
export class ServerSettings {
  @observable tags;
  @observable admins;

  constructor(apiClient, deepObserver) {
    this.client = apiClient;
    this.sizes = [
      { id: 'none', name: 'None' },
      { id: 'very-low', name: 'Very low' },
      { id: 'low', name: 'Low' },
      { id: 'normal', name: 'Normal' },
      { id: 'high', name: 'High' },
      { id: 'very-high', name: 'Very high' },
    ];

    this.mapSettings = null;
    this.mapGenSettings = null;
    this.mapSettingsSub = deepObserver.observe(this, 'mapSettings', this.mapSettingsChanged.bind(this));
    this.mapGenSettingsSub = deepObserver.observe(this, 'mapGenSettings', this.mapGenSettingsChanged.bind(this));
    this.getMapSettings();
    this.getMapGenSettings();
  }

  getMapSettings() {
    this.client.getMapSettings()
      .then(settings => {
        this.mapSettings = settings;
      });
  }

  getMapGenSettings() {
    this.client.getMapGenSettings()
      .then(settings => {
        this.mapGenSettings = settings;
      });
  }

  mapSettingsChanged(newValue, oldValue, property) {
    console.log(property, oldValue, newValue);

    if (oldValue === newValue)
      return;

    this.saveMapSettings();
  }

  mapGenSettingsChanged(newValue, oldValue, property) {
    console.log(property, oldValue, newValue);

    if (oldValue === newValue)
      return;

    this.saveMapGenSettings();
  }

  // tagsChanged(newValue, oldValue) {
  //   this.settings.tags = newValue.split(',').map(o => { return o });
  // }

  // adminsChanged(newValue, oldValue) {
  //   this.settings.admins = newValue.split(',').map(o => { return o });
  // }

  saveMapSettings() {
    this.client.saveMapSettings(this.mapSettings);
  }

  saveMapGenSettings() {
    this.client.saveMapGenSettings(this.mapGenSettings);
  }

  generateMap() {
    this.client.generateMap('TestGen');
  }
}
