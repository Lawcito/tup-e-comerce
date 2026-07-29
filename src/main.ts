import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';

import { appConfig } from './app/app.config';
import { App } from './app/app';

Sentry.init({
  dsn: 'https://43892da7659c7e8c28c0bc937daf0bf0@o4511781015977984.ingest.us.sentry.io/4511781021155328',
  dataCollection: {},
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
