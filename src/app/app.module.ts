import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
