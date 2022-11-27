import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import {SharedModule} from './modules/shared/shared.module';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CoreService} from './modules/shared/services/core/core.service';
import {ToastModule} from 'primeng/toast';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ButtonModule} from "primeng/button";
import {ElectronService} from "./modules/shared/services/core/electron.service";

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        SharedModule,
        AppRoutingModule,
        AngularSvgIconModule,
        AngularSvgIconModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ToastModule,
        ButtonModule
    ],
  providers: [DialogService, MessageService, CoreService, ConfirmationService, ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule {}

