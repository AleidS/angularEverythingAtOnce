import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// import { map, Map as LeafletMap, TileLayer, tileLayer } from 'leaflet';
import { environment } from 'src/environments/environment';
import { asyncForEach } from 'src/app/common/utility';
import { basemapProvider } from 'src/app/common/helper/leaflet/basemap-provider';
import { dataProvider } from 'src/app/common/helper/leaflet/data-provider';
import { dataProviderNL } from 'src/app/common/helper/leaflet/nl-data-provider'
import { dataProviderTomorrow } from 'src/app/common/helper/leaflet/data-provider-tomorrow';

import 'src/assets/libs/leaflet.rainviewer.css';
import { P } from 'node_modules/@angular/cdk/platform.d-B3vREl3q';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import 'leaflet.vectorgrid';
declare const L: any;


@Component({
  selector: 'app-weather',
  standalone: false,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})


export class WeatherComponent implements AfterViewInit {

  showWeather = true
  showRailways = true
  showTraffic = true
  darkMode:boolean = false

  toggleDarkMode(event:MatSlideToggleChange){
   this.darkMode = event.checked
   if (event.checked){
    this.addDarkMode();
    this.removeLayer('lightMode');
    this.removeLayer('basemap')
    this.removeLayer('Esri');
    document.body.classList.add('darkmode');
    this.addActiveLayers();
   }
   else{
    this.removeLayer('darkMode');
    this.addBaseMap();
    this.addLightMode();
    document.body.classList.remove('darkmode');
    this.addActiveLayers();

   }
  }
  toggleTraffic(){
    this.showTraffic=!this.showTraffic

    if (this.showTraffic==true){
      this.addTrafficIncidents();
    }
    if (this.showTraffic==false){
      this.removeLayer('trafficFlowTomTom');
      this.removeLayer('trafficIncidentsTomTom');
      this.removeLayer('trafficIncidentsTomTom2');

    }
  }
  
  rain = L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: ' ▶⏸',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
  })
  

  toggleWeather(){
    this.showWeather=!this.showWeather
    if (this.showWeather){
      this.addLayer('rain',this.rain);
      this.rain.load(this.map)
      // this.rain.play()
    }
    else{
      this.removeLayer('rain');
      this.rain.unload(this.map);
      console.log('removed')
      setTimeout(()=>{},3000)
    }

  }
 
  toggleRailways(){
    this.showRailways=!this.showRailways
    if (this.showRailways){
      this.addNSDelays()
    }
    else{
      this.removeLayer('ns-delays')
    }
  }

  addActiveLayers(){
    if (this.showTraffic==true){
      this.addTrafficIncidents();
    }
    if (this.showTraffic==false){
      this.removeLayer('trafficFlowTomTom');
      this.removeLayer('trafficIncidentsTomTom');
      this.removeLayer('trafficIncidentsTomTom2');

    }
    if (this.showWeather){
      this.addLayer('rain',this.rain);
      this.rain.load(this.map)
      // this.rain.play()
    }
    else{
      this.removeLayer('rain');
      this.rain.unload(this.map);
      console.log('removed')
      setTimeout(()=>{},3000)
    }
    if (this.showRailways){
      this.addNSDelays()
    }
    else{
      this.removeLayer('ns-delays')
    }

  }
  
  // addRailways(){
  //   this.addLayer('railways',
  //     L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png')
  //   )
  // }
  addDarkMode(){
    this.addLayer('darkMode', L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }));
  }

  addNasa(){
    this.addLayer('Nasa', L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
      attribution: '<a href="https://earthdata.nasa.gov">GIBS / NASA / ESDIS</a>.',
      bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
      minZoom: 1,
      maxZoom: 8,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
    }));
  }
  addLightMode(){
    this.addLayer('lightMode', L.tileLayer(basemapProvider.cartoLightLabelOnly.uri, basemapProvider.cartoLightLabelOnly.options));
    // this.addLayer('openstreetmap',
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    // )
    // this.addLayer('stadia_outdoors', L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}', {
    //   minZoom: 0,
    //   maxZoom: 20,
    //   attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   ext: 'png'
    // }));
    this.addLayer('Esri', L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    }))
  }
  addBaseMap(){
    this.addLayer('baseMap', L.tileLayer(basemapProvider.cartoLightNoLabel.uri, basemapProvider.cartoLightNoLabel.options));
  }

  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;
  public map!: any;
  private tileLayers: Map<string, any> = new Map<string, any>();

  // Map providers: https://leaflet-extras.github.io/leaflet-providers/preview/

  public async ngAfterViewInit(): Promise<void> {
    this.map = L.map(this.mapElement.nativeElement);
    this.map.setView([environment.leaflet.defaultCenter[0], environment.leaflet.defaultCenter[1]], 7);  
    // this.addLayer('nws', tileLayer.wms(dataProvider.nwsRadar.uri, dataProvider.nwsRadar.options));
    // this.addLayer('tomorrow', tileLayer(dataProvider.tomorrowRadar.url));
    // this.addLayer('nl',tileLayer.wms(dataProviderNL.openMeteoRadar.uri, dataProvider.nwsRadar.options));
    this.addBaseMap();
    this.addLightMode();
   
    // const url = environment.tomorrowIOLink
    // this.addLayer('weather', tileLayer(url))
    this.addNSDelays();
    this.addTrafficIncidents();
    this.addLayer('rain',this.rain);
    this.rain.load(this.map)

   
    // rainviewer.addTo(this.map);
  }

  addTrafficIncidents(){
      this.addLayer('trafficFlowTomTom', L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${environment.tomTomApiKey}&roadTypes=[5]&thickness=2`));
      this.addLayer('trafficIncidentsTomTom', L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/incidents/s0/{z}/{x}/{y}.png?key=${environment.tomTomApiKey}&t=-1`));
      this.addLayer('trafficIncidentsTomTom2', L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/incidents/s1/{z}/{x}/{y}.png?key=${environment.tomTomApiKey}&t=-1&thickness=1`));
  }

  
  addTrafficFlow(){
    this.addLayer('trafficFlowTomTom', L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${environment.tomTomApiKey}&roadTypes=[5]&thickness=2`))
  }


  async addNSDelays() {
    const url = 'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen.geojson?actual=true';
    const response = await fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': environment.nsApiKey
      }
    });
    if (!response.ok) {
      console.error('Failed to fetch NS GeoJSON:', response.statusText);
      return;
    }
    const geojson = await response.json();
    console.log(geojson)
    const geoJsonLayer = L.geoJSON(geojson, {
      style: (feature: any) => ({
        color: feature.properties.disruptionType == 'WERKZAAMHEID' ? 'orange' : 'red',
        weight: 3,
        opacity: 0.8
      }),
      onEachFeature: (feature: any, layer: any) => {
        if (feature.properties && feature.properties.disruptionType) {
          layer.bindPopup(feature.properties.disruptionType);
        }
      }
    });
    this.addLayer('ns-delays', geoJsonLayer);
  }

  public async addAllLayers(): Promise<void> {
    try {
      return asyncForEach(Array.from(this.tileLayers.entries()), (entry: [string, any], index: number) => {
        this.addLayer(entry[0], entry[1]);
      });
    } catch (error) {
      throw(error);
    }
  }

  public addLayer(identifier: string, layer: any) {
    // Remove the layer if it exists, only because we want the actual layer on the map to go away
    // not just overwrite the entry in tileLayers - since we are doing a layer.addTo(this.map) it would
    // just stack it (indefinitely). TL;DR -> prevent a memory leak!
    if (this.tileLayers.has(identifier)) this.removeLayer(identifier);
    this.tileLayers.set(identifier, layer);
    layer.addTo(this.map);
  }

  public async applyLayers(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.removeAllLayers();
        await this.addAllLayers();
        resolve();
      } catch (error){
        reject(error);
      }
    });
  }

  public clearTileLayers(): void {
    this.tileLayers.clear();
  }

  public async removeAllLayers(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await asyncForEach(Array.from(this.tileLayers.entries()), (entry: [string,any], index: number) => {
          this.removeLayer(entry[0]);
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public removeLayer(identifier: string): void {
    if (this.tileLayers.has(identifier)) {
      // Remove from map
      this.map.removeLayer(this.tileLayers.get(identifier) as any);

      // Remove from dictionary of tileLayers
      this.tileLayers.delete(identifier);
      
    } else {
      throw new Error(`Cannot remove layer with identifier '${identifier}' because it does not exist in the dictionary`);
    }
  }
}