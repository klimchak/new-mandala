import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {ColorPickerComponent} from './components/color-picker/color-picker.component';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {SliderModule} from 'primeng/slider';
import {ShadowHelpTextComponent} from './components/shadow-help-text/shadow-help-text.component';
import {SharedModalsModule} from './modals/shared-modals.module';
import {ProgressComponent} from './components/progress/progress.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {SharedPipesModule} from './pipes/shared-pipes.module';
import {WheelDirective} from "./wheel.directive";

@NgModule({
  declarations: [SpinnerComponent, ColorPickerComponent, ShadowHelpTextComponent, ProgressComponent, WheelDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    SliderModule,
    SharedModalsModule,
    ProgressBarModule,
    SharedPipesModule
  ],
  exports: [SpinnerComponent, ColorPickerComponent, ShadowHelpTextComponent, ProgressComponent, WheelDirective],
  providers: [DatePipe],
})
export class SharedModule {
}
