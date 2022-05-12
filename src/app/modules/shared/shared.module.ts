import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {ColorPickerComponent} from './components/color-picker/color-picker.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SliderModule} from "primeng/slider";

@NgModule({
  declarations: [SpinnerComponent, ColorPickerComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, RippleModule, SliderModule],
  exports: [SpinnerComponent, ColorPickerComponent],
  providers: [DatePipe],
})
export class SharedModule {
}
