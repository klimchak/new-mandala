import {Component, ViewEncapsulation} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ALL_WORDS} from '../../constants';
import {ConfirmPopupAnswerModel, ConfirmPopupEntriesModel} from '../../models/confirm-popup.model';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent {
  public strings = ALL_WORDS.BUTTON.DIALOGS.confirm_dialog;

  public get entityData(): ConfirmPopupEntriesModel {
    return this.dialogConfig.data;
  }

  public noRemand: boolean = false;
  public removeLatest: boolean = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {
  }

  public close(answer?: boolean): void {
    this.dialogRef.close({
      answer,
      noRemandAgain: this.noRemand,
      removeLatestVersion: this.removeLatest
    } as ConfirmPopupAnswerModel);
  }
}
