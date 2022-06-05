import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
// import {AngularSvgIconModule} from 'angular-svg-icon';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, ButtonModule, /*AngularSvgIconModule,*/ CheckboxModule, FormsModule],
  declarations: [ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent],
})
export class SharedModalsModule {}
