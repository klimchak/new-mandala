import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
// import {AngularSvgIconModule} from 'angular-svg-icon';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {UpdateDialogComponent} from './update-dialog/update-dialog.component';

@NgModule({
  imports: [CommonModule, ButtonModule, /*AngularSvgIconModule,*/ CheckboxModule, FormsModule],
  declarations: [ConfirmationDialogComponent, UpdateDialogComponent],
  exports: [ConfirmationDialogComponent, UpdateDialogComponent],
})
export class SharedModalsModule {}
