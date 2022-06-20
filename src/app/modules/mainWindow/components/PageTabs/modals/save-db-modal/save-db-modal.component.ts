import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MovingDialogComponent} from '../../../../../shared/modals/moving-dialog/moving-dialog.component';
import {MandalaParamsModel} from '../../../../../shared/models/mandala-params.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
  ToastNotificationsService
} from '../../../../../shared/services/toast-notifications/toast-notifications.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PopupActionsEnum, PopupCallbackModel} from '../../../../../shared/models/popup-callback.model';
import {EDITOR_MODULES} from '../../../../../shared/constants';

@Component({
  selector: 'app-save-db-modal',
  templateUrl: './save-db-modal.component.html',
  styleUrls: ['./save-db-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveDbModalComponent extends MovingDialogComponent implements OnInit {
  public popupForm: FormGroup;
  public editorModules = EDITOR_MODULES;
  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toastNotificationService: ToastNotificationsService
  ) {
    super();
  }

  private get mandalaParams(): MandalaParamsModel {
    return this.dynamicDialogConfig.data.mandalaParams;
  }

  public ngOnInit(): void {
    this.addMovingForDialog();
    this.popupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      patronymic: new FormControl(''),
      description: new FormControl(''),
      createDate: new FormControl(new Date(), [Validators.required]),
    });
  }

  public closeModalWindow(callback?: PopupCallbackModel): void {
    this.dialogRef.close(callback);
  }

  public processForm(): void {
    this.popupForm.markAllAsTouched();
    if (this.popupForm.valid) {
      const payload = {...this.mandalaParams, ...this.popupForm.getRawValue()};
      payload.createDate = payload.createDate.toISOString();
      const actionType = payload.id ? PopupActionsEnum.UPDATE : PopupActionsEnum.CREATE;
      this.closeModalWindow({body: payload, action: actionType, changed: true});
    } else {
      this.toastNotificationService.showNotification('warning', {message: 'Data in the fields is`t valid'});
    }
  }
}
