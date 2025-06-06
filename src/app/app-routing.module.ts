import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './pages/info/info.component';


const routes: Routes = [
  {
    loadChildren: () => import('./feature/weather/weather.module').then(m => m.WeatherModule),
    path: ''
  
  },
  { path: 'info', component: InfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
