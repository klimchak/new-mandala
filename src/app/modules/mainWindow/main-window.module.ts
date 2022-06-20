import {NgModule} from '@angular/core';
import {MainWindowRouting} from './main-window.routing';
import {MainWindowComponent} from './components/main-window.component';
import {PageTabsComponent} from './components/PageTabs/page-tabs.component';
import {TabViewModule} from 'primeng/tabview';
import {ButtonModule} from 'primeng/button';
import {ParamsModalComponent} from './components/PageTabs/modals/params-modal/params-modal.component';
import {EditorComponent} from './components/PageTabs/editor/editor.component';
import {SaviorComponent} from './components/PageTabs/savior/savior.component';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {SliderModule} from 'primeng/slider';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ColoredModalComponent} from './components/PageTabs/modals/colored-modal/colored-modal.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SaveImageModalComponent} from './components/PageTabs/modals/save-image-modal/save-image-modal.component';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SaveDbModalComponent} from './components/PageTabs/modals/save-db-modal/save-db-modal.component';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {EditorModule} from 'primeng/editor';
import {TableModule} from 'primeng/table';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ContextMenuModule} from 'primeng/contextmenu';

const tabsComponents = [
  ParamsModalComponent,
  MainWindowComponent,
  PageTabsComponent,
  EditorComponent,
  SaviorComponent,
  ColoredModalComponent,
  SaveImageModalComponent,
  SaveDbModalComponent
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
        ContextMenuModule
    ],
  exports: [...tabsComponents]
})
export class MainWindowModule {
}
