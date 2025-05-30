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


  public showWeather:boolean = true
  public showRailways:boolean = true
  public showTraffic:boolean = true
  darkMode:boolean = false
  trafficError:boolean=false
  trafficErrorShown:boolean=false
  railwayError:boolean=false
  railwayErrorShown:boolean=false
  weatherError:boolean=false //not used
  weatherErrorShown:boolean=false
  showLegend:boolean=false;

  toggleDarkMode(event:MatSlideToggleChange){
   this.darkMode = event.checked
   if (event.checked){
    this.addDarkMode();
    this.removeLayer('lightMode');
    this.removeLayer('baseMap')
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
      // this.removeLayer('trafficIncidentsTomTom');
      this.removeLayer('trafficIncidentsTomTom2');

    }
  }
  toggleLegend(){
    this.showLegend=!this.showLegend;
  }
  
  rain = L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: ' ▶||',
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
    // if (this.showTraffic==false){
    //   this.removeLayer('trafficFlowTomTom');
    //   // this.removeLayer('trafficIncidentsTomTom');
    //   this.removeLayer('trafficIncidentsTomTom2');

    // }
    if (this.showWeather){
      // this.addLayer('rain',this.rain);
      // this.rain.load(this.map)
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
  

  buttons : {name:string,function:Function,iconName:string,active:string,error:string}[] = [
    {name:'weather',
      function: ()=> this.toggleWeather(),
      iconName:'cloud',
      active:'showWeather',
      error:'weatherErrorShown'
    },
    {name:'trains',
      function: ()=> this.toggleRailways(),
      iconName:'train',
      active:'showRailways',
      error:'railwayErrorShown',
    },
    {name:'traffic',
      function: ()=> this.toggleTraffic(),
      iconName:'directions_car',
      active:'showTraffic',
      error:'trafficErrorShown',
    },
  ];
//cant put this.showTraffic directly in above array because it won't udpate, so;

  isActive(prop: string) {
    return (this as any)[prop];
  }
  hasError(prop: string) {
    return (this as any)[prop];
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
    let trafficFlowLayer = null
 
      trafficFlowLayer = L.tileLayer(`${environment.apiBaseUrl}/tomtom-tile-proxy.php/flow/relative/{z}/{x}/{y}.png?roadTypes=[5]&thickness=2`);
    
      trafficFlowLayer.on('tileerror', (error: any) => {
        console.error('Traffic Flow TomTom tile failed to load, it might be that the free API requests have run out:', error);
        // Optionally, show a user-friendly message or fallback
        // e.g., this.showTrafficError = true;
        this.trafficError=true
      });
      this.addLayer('trafficFlowTomTom', trafficFlowLayer);

      
      const trafficIncidentsLayer =  L.tileLayer(`${environment.apiBaseUrl}/tomtom-tile-proxy.php/incidents/s1/{z}/{x}/{y}.png?key=${environment.tomTomApiKey}&t=-1&thickness=1`,  {attribution:'TomTom'});
      trafficFlowLayer.on('tileerror', (error: any) => {
        console.error('Traffic Incidents TomTom tile failed to load, it might be that the free API requests have run out:', error);
        // Optionally, show a user-friendly message or fallback
        // e.g., this.showTrafficError = true;
        this.trafficError=true
      });
      this.addLayer('trafficIncidentsTomTom2',trafficIncidentsLayer)
  }

  
  addTrafficFlow(){
    this.addLayer('trafficFlowTomTom', L.tileLayer(`${environment.apiBaseUrl}/tomtom-tile-proxy.php/flow/relative/{z}/{x}/{y}.png?roadTypes=[5]&thickness=2`))
  }


  async addNSDelays() {
    const url = `${environment.apiBaseUrl}/ns-delays-proxy.php`;
    const response = await fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': environment.nsApiKey
      }
    });
    if (!response.ok) {
      console.error('Failed to fetch NS GeoJSON:', response.statusText);
      // Optionally, show a user-friendly message or fallback
      // e.g., this.showTrafficError = true;
      this.railwayError=true
    }
    const geojson = await response.json();
    console.log(geojson)
    if (response.ok){
      const geoJsonLayer = L.geoJSON(geojson, {
        style: (feature: any) => ({
          color: feature.properties.disruptionType == 'WERKZAAMHEID' ? 'orange' : '#DD0000',
          weight: 4,
          opacity: 1,
        }),
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties && feature.properties.disruptionType) {
            layer.bindPopup(
            (feature.properties.disruptionType == 'WERKZAAMHEID' ? 
              `Train/Track Maintainance `
              :feature.properties.disruptionType == 'STORING' ? 
              `Train Disruption`
              :feature.properties.disruptionType )
              + `<br/> <a target="_blank" href='https://www.ns.nl/reisinformatie/actuele-situatie-op-het-spoor/disruption?id=${feature.id}'>More info at NS website</a>`);
            if (feature.properties.disruptionType =='WERKZAAMHEID'){
              layer.bindTooltip('<svg width="20" height="22" viewBox="0 0 25 29" fill="none" xmlns="http://www.w3.org/2000/svg">\
                                    <mask id="mask0_1_38" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="29">\
                                      <rect x="0.98189" y="0.0309792" width="24" height="28.2423" fill="#D9D9D9"/>\
                                    </mask>\
                                    <g mask="url(#mask0_1_38)">\
                                      <path d="M12.9819 6.27333C13.3685 6.27333 13.7474 6.28056 14.1186 6.29188L12.6801 7.3827L12.3276 7.6493L12.5493 8.03212L12.6899 8.27528C11.0722 8.28628 9.87788 8.38915 9.10689 8.58583C8.29033 8.79413 7.73211 9.02337 7.43209 9.27333H13.268L14.3891 11.2099L14.4262 11.2733H13.9819V14.2733H18.9819V13.2157H20.9819V19.7733C20.9819 20.7567 20.6442 21.5856 19.9692 22.2606C19.2942 22.9356 18.4652 23.2733 17.4819 23.2733L18.9819 24.7733V25.2733H16.9819L14.9819 23.2733H10.9819L8.98189 25.2733H6.98189V24.7733L8.48189 23.2733C7.49856 23.2733 6.66959 22.9356 5.99459 22.2606C5.31959 21.5856 4.98189 20.7567 4.98189 19.7733V10.2733C4.98189 9.39006 5.21112 8.68601 5.66939 8.16102C6.12772 7.63602 6.73189 7.23583 7.48189 6.96083C8.23188 6.68583 9.08606 6.50269 10.0444 6.41102C11.0027 6.31936 11.9819 6.27333 12.9819 6.27333ZM6.98189 19.7733C6.98189 20.2067 7.12336 20.5652 7.40669 20.8485C7.69003 21.1319 8.04856 21.2733 8.48189 21.2733H17.4819C17.9152 21.2733 18.2738 21.1319 18.5571 20.8485C18.8404 20.5652 18.9819 20.2067 18.9819 19.7733V16.2733H6.98189V19.7733ZM9.48189 17.2733C9.91522 17.2733 10.2738 17.4148 10.5571 17.6981C10.8404 17.9815 10.9819 18.34 10.9819 18.7733C10.9819 19.2067 10.8404 19.5652 10.5571 19.8485C10.2738 20.1319 9.91522 20.2733 9.48189 20.2733C9.04856 20.2733 8.69003 20.1319 8.40669 19.8485C8.12336 19.5652 7.98189 19.2067 7.98189 18.7733C7.98189 18.34 8.12336 17.9815 8.40669 17.6981C8.69003 17.4148 9.04856 17.2733 9.48189 17.2733ZM16.4819 17.2733C16.9152 17.2733 17.2738 17.4148 17.5571 17.6981C17.8404 17.9815 17.9819 18.34 17.9819 18.7733C17.9819 19.2067 17.8404 19.5652 17.5571 19.8485C17.2738 20.1319 16.9152 20.2733 16.4819 20.2733C16.0486 20.2733 15.69 20.1319 15.4067 19.8485C15.1234 19.5652 14.9819 19.2067 14.9819 18.7733C14.9819 18.34 15.1234 17.9815 15.4067 17.6981C15.69 17.4148 16.0486 17.2733 16.4819 17.2733ZM6.98189 14.2733H11.9819V11.2733H6.98189V14.2733ZM16.9292 10.8016C16.9965 10.8426 17.0665 10.8793 17.1372 10.9149L17.1821 11.2733H15.3667L16.7534 10.6893C16.8114 10.7275 16.8699 10.7656 16.9292 10.8016Z" \
                                      fill="#CC6600"/>\
                                      <path d="M17.9408 11.8251L17.7264 10.1096C17.6102 10.0649 17.5007 10.0113 17.398 9.94879C17.2952 9.88625 17.1947 9.81924 17.0964 9.74776L15.5016 10.4179L14.0273 7.87141L15.4077 6.82602C15.3988 6.76348 15.3943 6.70317 15.3943 6.64509V6.28322C15.3943 6.22515 15.3988 6.16483 15.4077 6.10229L14.0273 5.0569L15.5016 2.51043L17.0964 3.18056C17.1947 3.10908 17.2975 3.04206 17.4047 2.97952C17.5119 2.91697 17.6191 2.86336 17.7264 2.81869L17.9408 1.10318H20.8893L21.1038 2.81869C21.2199 2.86336 21.3294 2.91697 21.4321 2.97952C21.5349 3.04206 21.6354 3.10908 21.7337 3.18056L23.3286 2.51043L24.8029 5.0569L23.4224 6.10229C23.4313 6.16483 23.4358 6.22515 23.4358 6.28322V6.64509C23.4358 6.70317 23.4269 6.76348 23.409 6.82602L24.7894 7.87141L23.3152 10.4179L21.7337 9.74776C21.6354 9.81924 21.5327 9.88625 21.4254 9.94879C21.3182 10.0113 21.211 10.0649 21.1038 10.1096L20.8893 11.8251H17.9408ZM19.4419 8.3405C19.9601 8.3405 20.4024 8.15733 20.7687 7.791C21.135 7.42466 21.3182 6.98238 21.3182 6.46416C21.3182 5.94593 21.135 5.50365 20.7687 5.13731C20.4024 4.77098 19.9601 4.58781 19.4419 4.58781C18.9147 4.58781 18.4702 4.77098 18.1083 5.13731C17.7465 5.50365 17.5655 5.94593 17.5655 6.46416C17.5655 6.98238 17.7465 7.42466 18.1083 7.791C18.4702 8.15733 18.9147 8.3405 19.4419 8.3405Z" \
                                      fill="#CC6600"/>\
                                    </g>\
                                  </svg>\
                                    ', {
              permanent:true,
              direction:'center',
              className: 'trainLabel'
              });
            }
            else {
            layer.bindTooltip('<svg width="20" height="22" viewBox="0 0 25 29" fill="#DDDD00" xmlns="http://www.w3.org/2000/svg">\
                                  <mask id="mask0_1_7" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="29">\
                                  <rect x="0.756733" y="0.0309792" width="24" height="28.2423" fill="#DDDD00"/>\
                                  </mask>\
                                  <g mask="url(#mask0_1_7)">\
                                    <path d="M12.7694 6.27333C12.7612 6.39624 12.7567 6.52041 12.7567 6.6454C12.7568 7.21249 12.8425 7.75957 13.0019 8.2743C12.9212 8.27393 12.8395 8.27333 12.7567 8.27333C10.9901 8.27333 9.6984 8.3775 8.88173 8.58583C8.06517 8.79414 7.50696 9.02337 7.20693 9.27333H13.4237C13.8666 10.0863 14.5095 10.774 15.2851 11.2733H13.7567V14.2733H18.7567V12.1229C19.4719 12.0587 20.1468 11.8573 20.7567 11.5458V19.7733C20.7567 20.7567 20.419 21.5856 19.744 22.2606C19.069 22.9356 18.2401 23.2733 17.2567 23.2733L18.7567 24.7733V25.2733H16.7567L14.7567 23.2733H10.7567L8.75673 25.2733H6.75673V24.7733L8.25673 23.2733C7.2734 23.2733 6.44443 22.9356 5.76943 22.2606C5.09443 21.5856 4.75673 20.7567 4.75673 19.7733V10.2733C4.75673 9.39006 4.98596 8.68601 5.44423 8.16102C5.90257 7.63602 6.50673 7.23583 7.25673 6.96083C8.00673 6.68583 8.86091 6.50269 9.81923 6.41102C10.7776 6.31936 11.7567 6.27333 12.7567 6.27333C12.761 6.27333 12.7652 6.27333 12.7694 6.27333ZM6.75673 19.7733C6.75673 20.2067 6.8982 20.5652 7.18154 20.8485C7.46487 21.1319 7.8234 21.2733 8.25673 21.2733H17.2567C17.6901 21.2733 18.0486 21.1319 18.3319 20.8485C18.6153 20.5652 18.7567 20.2067 18.7567 19.7733V16.2733H6.75673V19.7733ZM9.25673 17.2733C9.69007 17.2733 10.0486 17.4148 10.3319 17.6981C10.6153 17.9815 10.7567 18.34 10.7567 18.7733C10.7567 19.2067 10.6153 19.5652 10.3319 19.8485C10.0486 20.1319 9.69007 20.2733 9.25673 20.2733C8.8234 20.2733 8.46487 20.1319 8.18154 19.8485C7.8982 19.5652 7.75673 19.2067 7.75673 18.7733C7.75673 18.34 7.8982 17.9815 8.18154 17.6981C8.46487 17.4148 8.8234 17.2733 9.25673 17.2733ZM16.2567 17.2733C16.6901 17.2733 17.0486 17.4148 17.3319 17.6981C17.6153 17.9815 17.7567 18.34 17.7567 18.7733C17.7567 19.2067 17.6153 19.5652 17.3319 19.8485C17.0486 20.1319 16.6901 20.2733 16.2567 20.2733C15.8234 20.2733 15.4649 20.1319 15.1815 19.8485C14.8982 19.5652 14.7567 19.2067 14.7567 18.7733C14.7567 18.34 14.8982 17.9815 15.1815 17.6981C15.4649 17.4148 15.8234 17.2733 16.2567 17.2733ZM6.75673 14.2733H11.7567V11.2733H6.75673V14.2733Z" \
                                    fill="#EE0000"/>\
                                    <path d="M18.4396 8.832C18.5737 8.832 18.6862 8.78662 18.777 8.69585C18.8678 8.60508 18.9131 8.49261 18.9131 8.35843C18.9131 8.22425 18.8678 8.11178 18.777 8.02101C18.6862 7.93025 18.5737 7.88486 18.4396 7.88486C18.3054 7.88486 18.1929 7.93025 18.1021 8.02101C18.0114 8.11178 17.966 8.22425 17.966 8.35843C17.966 8.49261 18.0114 8.60508 18.1021 8.69585C18.1929 8.78662 18.3054 8.832 18.4396 8.832ZM17.966 6.93772H18.9131V4.09631H17.966V6.93772ZM18.4396 11.1998C17.7845 11.1998 17.1688 11.0755 16.5926 10.8269C16.0165 10.5783 15.5153 10.2409 15.0891 9.81466C14.6628 9.38845 14.3254 8.88725 14.0768 8.31108C13.8282 7.7349 13.7039 7.11926 13.7039 6.46415C13.7039 5.80905 13.8282 5.19341 14.0768 4.61723C14.3254 4.04106 14.6628 3.53986 15.0891 3.11365C15.5153 2.68744 16.0165 2.35002 16.5926 2.1014C17.1688 1.85277 17.7845 1.72846 18.4396 1.72846C19.0947 1.72846 19.7103 1.85277 20.2865 2.1014C20.8627 2.35002 21.3639 2.68744 21.7901 3.11365C22.2163 3.53986 22.5537 4.04106 22.8023 4.61723C23.0509 5.19341 23.1753 5.80905 23.1753 6.46415C23.1753 7.11926 23.0509 7.7349 22.8023 8.31108C22.5537 8.88725 22.2163 9.38845 21.7901 9.81466C21.3639 10.2409 20.8627 10.5783 20.2865 10.8269C19.7103 11.0755 19.0947 11.1998 18.4396 11.1998Z" \
                                    fill="#EE0000"/>\
                                  </g>\
                              </svg>\
                              ', {
              permanent:true,
              direction:'center',
              className: 'trainLabel train-Warning'
          });
          }
          
        }
      }
      });
      geoJsonLayer.on('tileerror', (error: any) => {
        console.error('NS delays tile failed to load, it might be that the free NS API requests have run out:', error);
        // Optionally, show a user-friendly message or fallback
        // e.g., this.showTrafficError = true;
        this.railwayError=true
      });
      geoJsonLayer.getAttribution = function() {return 'NS';}
      this.addLayer('ns-delays', geoJsonLayer);
    }
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