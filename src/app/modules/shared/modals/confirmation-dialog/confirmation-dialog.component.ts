import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ALL_WORDS} from '../../constants';
import {ConfirmPopupAnswerModel, ConfirmPopupEntriesModel, NoRemandType} from '../../models/confirm-popup.model';
import {MovingDialogComponent} from '../moving-dialog/moving-dialog.component';
import {CoreService} from '../../services/core/core.service';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent extends MovingDialogComponent implements OnInit {
  public strings = ALL_WORDS.BUTTON.DIALOGS.confirm_dialog;
  public noRemand = false;
  public removeLatest = false;
  public disableNoRemand = false;
  public disableRemoveLatest = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private coreService: CoreService
  ) {
    super();
  }

  public get entityData(): ConfirmPopupEntriesModel {
    return this.dialogConfig.data;
  }

  public ngOnInit(): void {
    if (this.entityData.noRemandAgain && this.entityData?.noRemandType) {
      switch (this.entityData.noRemandType) {
        case NoRemandType.EDIT_ITEM: {
          this.disableNoRemand = this.coreService.applicationOption.noRemandEdit;
          this.noRemand = this.coreService.applicationOption.noRemandEdit;
          break;
        }
        case NoRemandType.DELETE_ITEM: {
          this.disableNoRemand = this.coreService.applicationOption.noRemandDelete;
          this.noRemand = this.coreService.applicationOption.noRemandDelete;
          break;
        }
        case NoRemandType.UPDATE_APP: {
          this.disableNoRemand = this.coreService.applicationOption.noRemandUpdate;
          this.noRemand = this.coreService.applicationOption.noRemandUpdate;
          break;
        }
      }
    }
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
