import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KnmiComponent } from './knmi/knmi.component';
import {MatIconModule} from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
// import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { WeatherComponent } from "./feature/weather/weather.component";



@NgModule({
  declarations: [
    AppComponent,
    KnmiComponent,
    // LeafletMapComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
