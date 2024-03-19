import { Routes } from '@angular/router';
import { BandComponent } from './band/band.component';
import { TechComponent } from './tech/tech.component';
import { MediaComponent } from './media/media.component';

export const routes: Routes = [
    {path: 'band', component: BandComponent},  
    {path: 'tech', component: TechComponent},
    {path: 'media', component: MediaComponent},  
];

