import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DatesComponent } from './dates/dates.component';
import { BandComponent } from './band/band.component';
import { TechComponent } from './tech/tech.component';
import { MediaComponent } from './media/media.component';

export const routes: Routes = [
    {path: '', component: AppComponent},
    {path: 'dates', component: DatesComponent},
    {path: 'band', component: BandComponent},   
    {path: 'tech', component: TechComponent},
    {path: 'media', component: MediaComponent},
];
