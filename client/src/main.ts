import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  if ('serviceWorker' in navigator && environment.production) {
    console.log("[Angular main.ts] :: Registering Gigg service worker");
    navigator.serviceWorker.register('./gigg-service-worker.js');
  }
}).catch(err => console.log('[Angular main.ts] ::' + err));
