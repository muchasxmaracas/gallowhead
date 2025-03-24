import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; // Import appConfig properly

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Ensure that you export `config` like this:
export const config = mergeApplicationConfig(appConfig, serverConfig);
