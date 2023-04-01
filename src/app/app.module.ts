import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { CommonModule, registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';
import { enUS } from 'date-fns/locale';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

registerLocaleData(vi);
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `${window.location.origin}/assets/i18n/`, '.json');
}

export const nzConfig: NzConfig = {
  notification: {
    nzTop: '2rem',
  },
  message: {
    nzTop: '2rem',
  },
  // modal: {

  // }
};

const nzModules = [NzTagModule, NzSpinModule, NzInputModule, NzIconModule, ScrollingModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    nzModules,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: localStorage.getItem('language')?.toString() || 'vi',
    }),
  ],
  providers: [
    { provide: NZ_DATE_LOCALE, useValue: enUS },
    { provide: NZ_CONFIG, useValue: nzConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
