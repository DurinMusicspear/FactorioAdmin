import { inject, observable } from 'aurelia-framework';
import { ApiClient } from '../api-client';
import { DeepObserver } from '../deep-observer';

@inject(ApiClient, DeepObserver)
export class ServerSettings {
  @observable tags;
  @observable admins;

  constructor(apiClient, deepObserver) {
    this.client = apiClient;
    this.deepObserver = deepObserver;
    this.sizes = [
      // { id: 'none', name: 'None' },
      { id: 'very-low', name: 'Very low' },
      { id: 'low', name: 'Low' },
      { id: 'normal', name: 'Normal' },
      { id: 'high', name: 'High' },
      { id: 'very-high', name: 'Very high' },
    ];

    this.mapGenSettingsLoaded = false;
    this.mapSettingsLoaded = false;
    this.mapSettings = null;
    this.mapGenSettings = null;
    this.mapSettingsSub = this.deepObserver.observe(this, 'mapSettings', this.mapSettingsChanged.bind(this));
    this.mapGenSettingsSub = this.deepObserver.observe(this, 'mapGenSettings', this.mapGenSettingsChanged.bind(this));
    this.getMapSettings();
    this.getMapGenSettings();
  }

  getMapSettings() {
    this.client.getMapSettings()
      .then(settings => {
        this.mapSettings = settings;
        this.mapSettingsLoaded = true;
      });
  }

  getMapGenSettings() {
    this.client.getMapGenSettings()
      .then(settings => {
        let json = JSON.stringify(settings);
        json = json.replace(/-ore/g, '_ore');
        json = json.replace(/-oil/g, '_oil');
        json = json.replace(/-base/g, '_base');
        this.mapGenSettings = JSON.parse(json);
        this.mapGenSettingsLoaded = true;
      });
  }

  mapSettingsChanged(newValue, oldValue, property) {
    console.log(property, oldValue, newValue);

    if (oldValue === newValue || property === 'mapSettings')
      return;

    this.saveMapSettings();
  }

  mapGenSettingsChanged(newValue, oldValue, property) {
    console.log(property, oldValue, newValue);

    if (oldValue === newValue || property === 'mapGenSettings')
      return;

    this.saveMapGenSettings();
  }

  saveMapSettings() {
    this.client.saveMapSettings(this.mapSettings);
  }

  saveMapGenSettings() {
    var json = JSON.stringify(this.mapGenSettings);
    json = json.replace(/_ore/g, '-ore');
    json = json.replace(/_oil/g, '-oil');
    json = json.replace(/_base/g, '-base');
    this.client.saveMapGenSettings(JSON.parse(json));
  }

  generateMap() {
    this.client.generateMap('TestGen');
  }
}
