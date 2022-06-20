import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ALL_WORDS} from '../../constants';
import {ConfirmPopupAnswerModel, ConfirmPopupEntriesModel} from '../../models/confirm-popup.model';
import {MovingDialogComponent} from '../moving-dialog/moving-dialog.component';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent extends MovingDialogComponent implements OnInit {
  public strings = ALL_WORDS.BUTTON.DIALOGS.confirm_dialog;
  public noRemand = false;
  public removeLatest = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {
    super();
  }

  public get entityData(): ConfirmPopupEntriesModel {
    return this.dialogConfig.data;
  }

  public ngOnInit(): void {
    this.addMovingForDialog();
  }

  public close(answer?: boolean): void {
    this.dialogRef.close({
      answer,
      noRemandAgain: this.noRemand,
      removeLatestVersion: this.removeLatest
    } as ConfirmPopupAnswerModel);
  }
}
