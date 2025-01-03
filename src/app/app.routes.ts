import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BandComponent } from './band/band.component';
import { TechComponent } from './tech/tech.component';
import { MediaComponent } from './media/media.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'band', component: BandComponent},  
    {path: 'tech', component: TechComponent},
    {path: 'media', component: MediaComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full' }  
];

