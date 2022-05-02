import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreviewModalComponent } from './image-preview-modal/image-preview-modal.component';
import { ButtonModule } from 'primeng/button';
import {FilesPopupComponent} from './files-popup/files-popup.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  imports: [CommonModule, ButtonModule, AngularSvgIconModule],
  declarations: [ImagePreviewModalComponent, ConfirmationDialogComponent, FilesPopupComponent],
  exports: [ImagePreviewModalComponent, ConfirmationDialogComponent],
})
export class SharedModalsModule {}
