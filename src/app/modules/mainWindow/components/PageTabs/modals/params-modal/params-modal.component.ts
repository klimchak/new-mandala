import {Component, OnInit} from '@angular/core';
import {MANDALA_VARIANTS, MandalaVariant, PAPER_VARIANTS} from '../../../../../../constants';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
  ToastNotificationsService
} from '../../../../../shared/services/toast-notifications/toast-notifications.service';
import {MandalaParamsModel} from '../../../../../shared/models/mandala-params.model';
import {PopupActionsEnum, PopupCallbackModel} from '../../../../../shared/models/popup-callback.model';
import {ALL_WORDS} from '../../../../../shared/constants';
import {MovingDialogComponent} from '../../../../../shared/modals/moving-dialog/moving-dialog.component';
import {CoreService} from '../../../../../shared/services/core/core.service';
import {find} from 'lodash';

@Component({
  selector: 'app-params-modal',
  templateUrl: './params-modal.component.html',
  styleUrls: ['params-modal.component.scss']
})
export class ParamsModalComponent extends MovingDialogComponent implements OnInit {
  public generationVariant = MANDALA_VARIANTS;
  public paperVariant = PAPER_VARIANTS;
  public paramsForm: FormGroup = new FormGroup({});
  private ALL_WORDS = ALL_WORDS;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toastNotificationService: ToastNotificationsService,
    private coreService: CoreService,
  ) {
    super();
  }

  public get marginSize(): string {
    if (this.paramsForm.get('marginSize')?.value) {
      return `${this.paramsForm.get('marginSize')?.value} мм`;
    } else {
      return '';
    }
  }

  public get strokeWidth(): string {
    if (this.paramsForm.get('strokeWidth')?.value) {
      return `${this.paramsForm.get('strokeWidth')?.value} мм`;
    } else {
      return '';
    }
  }

  public get fontSize(): string {
    if (this.paramsForm.get('fontSize')?.value) {
      return `${this.paramsForm.get('fontSize')?.value} пт`;
    } else {
      return '';
    }
  }

  public get fontSizeMM(): string {
    if (this.paramsForm.get('fontSize')?.value) {
      return `${Math.floor(this.coreService.replacePtToMm(this.paramsForm.get('fontSize')?.value))} мм`;
    } else {
      return '';
    }
  }

  public get fontSizeError(): string {
    if (this.paramsForm.get('fontSize')?.value) {
      return `${Math.floor(100 - ( ( Math.floor(this.coreService.replacePtToMm(this.paramsForm.get('fontSize')?.value)) / this.coreService.replacePtToMm(this.paramsForm.get('fontSize')?.value) ) * 100))} %`;
    } else {
      return '';
    }
  }

  public get numberColor(): string {
    return `color: ${this.paramsForm.get('numberColor')?.value}`;
  }

  public get abbreviationTooltipText(): string {
    if (!this.paramsForm.get('double')?.value) {
      return this.ALL_WORDS.TOOLTIP.TOOLTIP_ABBREVIATION.DISABLED_FORM;
    }
    return this.paramsForm.get('abbreviation')?.value ?
      this.ALL_WORDS.TOOLTIP.TOOLTIP_ABBREVIATION.ENABLED_FORM.enable :
      this.ALL_WORDS.TOOLTIP.TOOLTIP_ABBREVIATION.ENABLED_FORM.disable;
  }

  public get doubleTooltipText(): string {
    if (this.paramsForm.get('double')?.value) {
      return this.paramsForm.get('abbreviation')?.value ?
        this.ALL_WORDS.TOOLTIP.TOOLTIP_DOUBLE.enable.enable_abbreviation :
        this.ALL_WORDS.TOOLTIP.TOOLTIP_DOUBLE.enable.disable_abbreviation;
    }
    return this.ALL_WORDS.TOOLTIP.TOOLTIP_DOUBLE.disable;
  }

  public get landscapeTooltipText(): string {
    return this.paramsForm.get('landscape')?.value ?
      this.ALL_WORDS.TOOLTIP.TOOLTIP_LANDSCAPE.enable :
      this.ALL_WORDS.TOOLTIP.TOOLTIP_LANDSCAPE.disable;
  }

  private get mandalaParams(): MandalaParamsModel {
    return this.coreService.mandalaParamsObj;
  }


  public ngOnInit(): void {
    this.addMovingForDialog();
    this.paramsForm = new FormGroup({
      baseWord: new FormControl(this.mandalaParams?.baseWord, [Validators.pattern(/^[а-яА-ЯёЁ0-9]+$/), Validators.required]),
      generationVariant: new FormControl(this.mandalaParams?.generationVariant, [Validators.required]),
      double: new FormControl(this.mandalaParams?.double),
      abbreviation: new FormControl({value: this.mandalaParams?.abbreviation || false, disabled: true}),
      landscape: new FormControl(this.mandalaParams?.landscape),
      paperVariant: new FormControl(this.mandalaParams?.paperVariant, [Validators.required]),
      marginSize: new FormControl(this.mandalaParams?.marginSize || 3),
      strokeWidth: new FormControl(this.mandalaParams?.strokeWidth || 0.5),
      fontSize: new FormControl(this.mandalaParams?.fontSize || 8),
      numberColor: new FormControl(this.mandalaParams?.fontSize || '#575757'),
    });
    this.setDouble(this.mandalaParams?.generationVariant);
  }

  public closeModalWindow(callback?: PopupCallbackModel): void {
    this.dialogRef.close(callback);
  }

  public setDouble(variant?: MandalaVariant): void {
    if (this.paramsForm.get('double')?.value) {
      this.paramsForm.get('abbreviation')?.enable();
      this.generationVariant.forEach((item) => {
        item.inactive = item.value === MandalaVariant.LIGHT_FROM_CENTER_MAND || item.value === MandalaVariant.LIGHT_IN_CENTER_MAND;
      });
    } else {
      this.paramsForm.get('abbreviation')?.disable();
      this.generationVariant.forEach((item) => {
        item.inactive = !(item.value === MandalaVariant.LIGHT_FROM_CENTER_MAND || item.value === MandalaVariant.LIGHT_IN_CENTER_MAND);
      });
    }
    this.paramsForm.get('generationVariant')
      .patchValue(typeof variant !== 'undefined' ? variant : find(this.generationVariant, (item) => !item.inactive).value);
  }

  public processForm(): void {
    this.paramsForm.markAllAsTouched();
    if (this.paramsForm.valid) {
      const payload = {...this.mandalaParams, ...this.paramsForm.getRawValue()};
      const actionType = payload.id ? PopupActionsEnum.UPDATE : PopupActionsEnum.CREATE;
      this.closeModalWindow({body: payload, action: actionType, changed: true});
    } else {
      this.toastNotificationService.showNotification('warning', {message: 'Data in the fields is`t valid'});
    }
  }
}
