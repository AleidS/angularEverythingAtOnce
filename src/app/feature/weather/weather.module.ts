import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';

import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
   WeatherComponent   
  ],
  imports: [
    CommonModule,
    WeatherRoutingModule,
    MatIconModule,
    MatIcon,
    MatSlideToggleModule,
    MatButtonModule
    
  ]
})
export class WeatherModule { }
