import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from "primeng/toast";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./modules/shared/shared.module";
import {AppRouting} from "./app.routing";
import {DialogService} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {CoreService} from "./modules/shared/services/core/core.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule,
    SharedModule,
    AppRouting,
    ToastModule,
    HttpClientModule,
  ],
  providers: [DialogService, MessageService, CoreService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
