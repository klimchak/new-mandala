import {Component, OnInit} from '@angular/core';
import {MANDALA_VARIANTS, MandalaVariant, PAPER_VARIANTS} from "../../../../../../constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  ToastNotificationsService
} from "../../../../../shared/services/toast-notifications/toast-notifications.service";
import {MandalaParams} from "../../../../../shared/models/MandalaParams";
import {PopupActionsEnum, PopupCallbackModel} from "../../../../../shared/models/popupCallbackModel";
import {ALL_WORDS} from "../../../../../shared/constants";

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['params.component.scss']
})
export class ParamsComponent implements OnInit {
  public generationVariant = MANDALA_VARIANTS;
  public paperVariant = PAPER_VARIANTS;
  public paramsForm: FormGroup = new FormGroup({});

  public get marginSize(): string {
    if (this.paramsForm.get('marginSize')?.value) {
      return `${this.paramsForm.get('marginSize')?.value} мм`;
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

  public get numberColor(): string {
    return `color: ${this.paramsForm.get('numberColor')?.value}`;
  }

  public get abbreviationTooltipText(): string {
    if (!this.paramsForm.get('double')?.value){
      return this.ALL_WORDS.TOOLTIP_ABBREVIATION.DISABLED_FORM;
    }
    return this.paramsForm.get('abbreviation')?.value ? this.ALL_WORDS.TOOLTIP_ABBREVIATION.ENABLED_FORM.enable : this.ALL_WORDS.TOOLTIP_ABBREVIATION.ENABLED_FORM.disable;
  }

  public get doubleTooltipText(): string {
    if (this.paramsForm.get('double')?.value) {
      return this.paramsForm.get('abbreviation')?.value ? this.ALL_WORDS.TOOLTIP_DOUBLE.enable.enable_abbreviation : this.ALL_WORDS.TOOLTIP_DOUBLE.enable.disable_abbreviation;
    }
    return this.ALL_WORDS.TOOLTIP_DOUBLE.disable;
  }

  public get landscapeTooltipText(): string {
    return this.paramsForm.get('landscape')?.value ? this.ALL_WORDS.TOOLTIP_LANDSCAPE.enable : this.ALL_WORDS.TOOLTIP_LANDSCAPE.disable;
  }

  private get mandalaParams(): MandalaParams {
    return this.dynamicDialogConfig.data.mandalaParams;
  }

  private ALL_WORDS = ALL_WORDS;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toastNotificationService: ToastNotificationsService,
  ) {
  }

  public ngOnInit(): void {
    this.paramsForm = new FormGroup({
      baseWord: new FormControl(this.mandalaParams?.baseWord, [Validators.pattern(/^[а-яА-ЯёЁ0-9]+$/), Validators.required]),
      generationVariant: new FormControl(this.mandalaParams?.generationVariant, [Validators.required]),
      double: new FormControl(this.mandalaParams?.double),
      abbreviation: new FormControl({value: this.mandalaParams?.abbreviation || false, disabled: true}),
      landscape: new FormControl(this.mandalaParams?.landscape),
      paperVariant: new FormControl(this.mandalaParams?.paperVariant, [Validators.required]),
      marginSize: new FormControl(this.mandalaParams?.marginSize || 3),
      fontSize: new FormControl(this.mandalaParams?.fontSize || 8),
      numberColor: new FormControl(this.mandalaParams?.fontSize || '#575757'),
    });
    this.setDouble();
  }

  public closeModalWindow(callback?: PopupCallbackModel): void {
    this.dialogRef.close(callback);
  }

  public setDouble(): void {
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
    this.paramsForm.get('generationVariant')?.patchValue('');
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
