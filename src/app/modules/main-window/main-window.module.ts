import {NgModule} from '@angular/core';
import {MainWindowRouting} from './main-window.routing';
import {PageTabsComponent} from './components/page-tabs/page-tabs.component';
import {TabViewModule} from 'primeng/tabview';
import {ButtonModule} from 'primeng/button';
import {ParamsModalComponent} from './components/modals/params-modal/params-modal.component';
import {SaviorComponent} from './components/savior/savior.component';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {SliderModule} from 'primeng/slider';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ColoredModalComponent} from './components/modals/colored-modal/colored-modal.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SaveImageModalComponent} from './components/modals/save-image-modal/save-image-modal.component';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SaveDbModalComponent} from './components/modals/save-db-modal/save-db-modal.component';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {EditorModule} from 'primeng/editor';
import {TableModule} from 'primeng/table';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ContextMenuModule} from 'primeng/contextmenu';
import {SharedPipesModule} from '../shared/pipes/shared-pipes.module';
import {InputNumberModule} from 'primeng/inputnumber';
import { SettingsComponent } from './components/settings/settings.component';
import {SelectButtonModule} from "primeng/selectbutton";
import {VirtualScrollerModule} from "primeng/virtualscroller";
import {SplitterModule} from "primeng/splitter";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {EditorComponent} from "./components/editor/editor.component";

const tabsComponents = [
  ParamsModalComponent,
  PageTabsComponent,
  EditorComponent,
  SaviorComponent,
  ColoredModalComponent,
  SaveImageModalComponent,
  SaveDbModalComponent
];

@NgModule({
  declarations: [...tabsComponents, SettingsComponent],
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
    SharedModule,
    ColorPickerModule,
    TooltipModule,
    RippleModule,
    InputSwitchModule,
    FormsModule,
    SlideMenuModule,
    FieldsetModule,
    CheckboxModule,
    CalendarModule,
    EditorModule,
    TableModule,
    AngularSvgIconModule,
    ContextMenuModule,
    SharedPipesModule,
    InputNumberModule,
    SelectButtonModule,
    VirtualScrollerModule,
    SplitterModule,
    ScrollPanelModule,
    ConfirmPopupModule
  ],
  exports: [...tabsComponents]
})
export class MainWindowModule {
}
