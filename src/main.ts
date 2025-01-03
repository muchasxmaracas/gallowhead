import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import your components
import { BandComponent } from './app/band/band.component';
import { HomeComponent } from './app/home/home.component';
import { TechComponent } from './app/tech/tech.component';
import { MediaComponent } from './app/media/media.component';
import { AppComponent } from './app/app.component';

const appRoutes = [
  { path: '', component: HomeComponent },
  { path: 'band', component: BandComponent },
  { path: 'tech', component: TechComponent },
  { path: 'media', component: MediaComponent }
];

// Bootstrap the application using AppComponent as the standalone component
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    BrowserAnimationsModule // Correct way to provide the router configuration
  ]
});
