import { Component } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-leaflet-map',
  standalone: false,
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([52.2660751, 6.1552165]) // Deventer
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    this.centerMap();
  }


  private initMap() {
    
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
    var radarUrl = "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi";
    var radarDisplayOptions = {
      layers: "nexrad-n0r-900913",
      format: "image/png",
      transparent: true
    };
 this.map.addLayer(L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(this.map))
    this.map.addLayer(
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  )
  this.map.addLayer(
      L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png')
  )
  // this.map.addLayer(
  //   L.control.rainviewer({ 
  //     position: 'bottomleft',
  //     nextButtonText: '>',
  //     playStopButtonText: 'Play/Stop',
  //     prevButtonText: '<',
  //     positionSliderLabelText: "Hour:",
  //     opacitySliderLabelText: "Opacity:",
  //     animationInterval: 500,
  //     opacity: 0.5
  // }))
}


  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
    // Fit the map into the boundary
    this.map.fitBounds(bounds);
    this.map.setView([52.2660751, 5.552165], 7);
  }
}