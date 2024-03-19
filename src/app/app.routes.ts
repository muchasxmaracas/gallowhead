import { Routes } from '@angular/router';
import { TechComponent } from './tech/tech.component';
import { MediaComponent } from './media/media.component';

export const routes: Routes = [ 
    {path: 'tech', component: TechComponent},
    {path: 'media', component: MediaComponent}  
];

