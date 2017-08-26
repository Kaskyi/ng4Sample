import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockConnection, MockBackend } from '@angular/http/testing';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { InMemoryDataService } from 'app/testing/in-memory';
import { fakeBackendProvider } from 'app/testing/fake-be';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeModule } from 'app/pages/home/home.module';
import { AppRoutingModule } from 'app/app.module.router';
import { AppTranslationModule } from 'app/app.translator';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HomeModule,
    AppRoutingModule,
    AppTranslationModule,

    InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [
     // providers used to create fake backend
     fakeBackendProvider,
     MockBackend,
     BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
