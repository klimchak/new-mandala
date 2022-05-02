import {NgModule} from '@angular/core';
import {MainWindowRouting} from "./main-window.routing";
import {MainWindowComponent} from "./components/main-window.component";
import {PageTabsComponent} from "./components/PageTabs/page-tabs.component";
import {TabViewModule} from "primeng/tabview";
import {ButtonModule} from "primeng/button";
import {ParamsComponent} from "./components/PageTabs/params/params.component";
import {EditorComponent} from './components/PageTabs/editor/editor.component';
import {SaviorComponent} from './components/PageTabs/savior/savior.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {ToggleButtonModule} from "primeng/togglebutton";
import {SliderModule} from "primeng/slider";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ColoredModalComponent} from './components/PageTabs/modals/colored-modal/colored-modal.component';
import {FileUploadModule} from "primeng/fileupload";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../shared/shared.module";

const tabsComponents = [
  ParamsComponent,
  MainWindowComponent,
  PageTabsComponent,
  EditorComponent,
  SaviorComponent,
  ColoredModalComponent
];

@NgModule({
  declarations: [...tabsComponents],
  imports: [
    MainWindowRouting,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToggleButtonModule,
    SliderModule,
    ScrollingModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [...tabsComponents]
})
export class MainWindowModule {
}
