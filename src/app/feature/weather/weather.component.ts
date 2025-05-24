import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// import { map, Map as LeafletMap, TileLayer, tileLayer } from 'leaflet';
import { environment } from 'src/environments/environment';
import { asyncForEach } from 'src/app/common/utility';
import { basemapProvider } from 'src/app/common/helper/leaflet/basemap-provider';
import { dataProvider } from 'src/app/common/helper/leaflet/data-provider';
import { dataProviderNL } from 'src/app/common/helper/leaflet/nl-data-provider'
import { dataProviderTomorrow } from 'src/app/common/helper/leaflet/data-provider-tomorrow';

declare const L: any;


@Component({
  selector: 'app-weather',
  standalone: false,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})


export class WeatherComponent implements AfterViewInit {

  showWeather = false
  showRailways = false
  showTraffic = false

  toggleTraffic(){
    this.showTraffic=!this.showTraffic
    this.ngAfterViewInit()
  }
  
  rain = L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
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
      this.removeLayer('rain')
    }

  }
 
  toggleRailways(){
    this.showRailways=!this.showRailways
    if (this.showRailways){
      this.addRailways()
    }
    else{
      this.removeLayer('railways')
    }
  }
  
  addRailways(){
    this.addLayer('railways',
      L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png')
    )
  }

  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;
  public map!: any;
  private tileLayers: Map<string, any> = new Map<string, any>();

  public async ngAfterViewInit(): Promise<void> {
    this.map = L.map(this.mapElement.nativeElement);
    this.map.setView([environment.leaflet.defaultCenter[0], environment.leaflet.defaultCenter[1]], 7);  
    this.addLayer('basemap', L.tileLayer(basemapProvider.cartoLightNoLabel.uri, basemapProvider.cartoLightNoLabel.options));
    // this.addLayer('nws', tileLayer.wms(dataProvider.nwsRadar.uri, dataProvider.nwsRadar.options));
    // this.addLayer('tomorrow', tileLayer(dataProvider.tomorrowRadar.url));
    // this.addLayer('nl',tileLayer.wms(dataProviderNL.openMeteoRadar.uri, dataProvider.nwsRadar.options));
    
    // const url = environment.tomorrowIOLink
    // this.addLayer('weather', tileLayer(url))
    this.addLayer('openstreetmap',
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      )
  
    this.addLayer('tomtom', L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.pbf?key=${environment.tomTomApiKey}&roadTypes=[2,4,5]`))

    this.addRailways();
   
  
   
    await this.addNsGeoJsonLayer();
    this.addLayer('basemap labels', L.tileLayer(basemapProvider.cartoLightLabelOnly.uri, basemapProvider.cartoLightLabelOnly.options));
   
    if (this.showWeather==true){
      this.addLayer('rain', this.rain)
    }
    // rainviewer.addTo(this.map);
  }

  async addNsGeoJsonLayer() {
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
        color: feature.properties.disruptionType == 'WERKZAAMHEID' ? 'yellow' : 'red',
        weight: 3,
        opacity: 0.8
      }),
      onEachFeature: (feature: any, layer: any) => {
        if (feature.properties && feature.properties.disruptionType) {
          layer.bindPopup(feature.properties.disruptionType);
        }
      }
    });
    this.addLayer('ns-geojson', geoJsonLayer);
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