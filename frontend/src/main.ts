import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router'; // <--- Importante
import { routes } from './app/app.routes'; // <--- Importante

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // <--- Esto "conecta" tus pantallas
  ]
}).catch((err) => console.error(err));