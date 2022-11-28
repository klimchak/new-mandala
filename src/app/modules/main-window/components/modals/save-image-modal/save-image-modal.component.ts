import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {jsPDF} from 'jspdf';
import {CoreService} from '../../../../shared/services/core/core.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ALL_WORDS} from '../../../../shared/constants';
import {MovingDialogComponent} from '../../../../shared/modals/moving-dialog/moving-dialog.component';
import {svg2pdf} from 'svg2pdf.js';
import {PaperOptions} from '../../../../shared/models/mandala.model';
import {LoadingService} from '../../../../shared/services/loader/loader.service';
import {Canvg} from 'canvg';
import {ToastNotificationsService} from '../../../../shared/services/toast-notifications/toast-notifications.service';
import {ToastNotificationsModel} from "../../../../shared/models/toast-notifications.model";
import ToastVariant = ToastNotificationsModel.ToastVariant;

@Component({
  selector: 'app-save-image-modal',
  templateUrl: './save-image-modal.component.html',
  styleUrls: ['./save-image-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveImageModalComponent extends MovingDialogComponent implements OnInit {
  public readonly messagesStrings = ALL_WORDS.otherStrings.messages;
  public ALL_WORDS = ALL_WORDS;
  public modalForm: FormGroup;

  public get mandalaIsRestored(): boolean {
    return this.coreService.mandalaIsRestored;
  }

  private sizes: PaperOptions;

  constructor(
    private coreService: CoreService,
    private loadingService: LoadingService,
    private toastNotificationsService: ToastNotificationsService
  ) {
    super();

    this.sizes = this.coreService.getPaperSize();
    this.modalForm = new FormGroup({
      additionalName: new FormControl(''),
      activeSchema: new FormControl(false),
      generationVariant: new FormControl(true),
      double: new FormControl(true),
      abbreviation: new FormControl(true),
      landscape: new FormControl(true),
      paperVariant: new FormControl(true)
    });
  }

  public get switcherSchemaTooltipText(): string {
    return this.onlySchema ? ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_SCHEMA.enable : ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_SCHEMA.disable;
  }

  public get autoName(): string {
    let version = this.coreService.mandalaVariantString();
    const setAddWord = this.coreService.isDoubleString();
    const abbrMand = this.coreService.isAbbreviationString();
    const setAlbum = this.coreService.isLandscapeString();
    const choicePaper = `_${this.coreService.paperVariant()}`;
    const schemaWord = this.modalForm.get('activeSchema')?.value ? '_Схема' : '_Цвет';
    let answer = `${this.modalForm.get('additionalName')?.value ? this.modalForm.get('additionalName')?.value : ''}`;
    answer += `${this.modalForm.get('additionalName')?.value ? '_' + this.coreService.mandalaParamsObj?.baseWord : this.coreService.mandalaParamsObj?.baseWord}`;
    answer += `${this.modalForm.get('generationVariant')?.value ? version : ''}`;
    answer += `${this.modalForm.get('double')?.value ? setAddWord : ''}`;
    answer += `${this.modalForm.get('abbreviation')?.value ? abbrMand : ''}`;
    answer += `${this.modalForm.get('landscape')?.value ? setAlbum : ''}`;
    answer += `${this.modalForm.get('activeSchema')?.value ? schemaWord : ''}`;
    answer += `${this.modalForm.get('paperVariant')?.value ? choicePaper : ''}`;
    return answer;
  }

  private get additionalName(): string {
    return this.modalForm.get('additionalName')?.value;
  }

  private get onlySchema(): boolean {
    return this.modalForm.get('activeSchema')?.value;
  }

  private get clearedElement(): HTMLElement {
    setTimeout(() => this.loadingService.setProgress(4), 10);
    this.coreService.removeZoomSVG();
    setTimeout(() => this.loadingService.setProgress(5), 10);
    const dWith = this.sizes.width;
    const dHeight = this.sizes.height;
    setTimeout(() => this.loadingService.setProgress(6), 10);
    const elem = document.getElementById('svgImg2');
    setTimeout(() => this.loadingService.setProgress(8), 10);
    elem.children[0].removeAttribute('transform');
    setTimeout(() => this.loadingService.setProgress(10), 10);
    elem.children[0].removeAttribute('style');
    setTimeout(() => this.loadingService.setProgress(12), 10);
    elem.setAttribute('viewBox', `${dWith / -2} ${dHeight / -2} ${dWith} ${dHeight}`);
    setTimeout(() => this.loadingService.setProgress(14), 10);
    return elem;
  }

  public ngOnInit(): void {
    this.addMovingForDialog();
  }

  public switchOnSchema(): void {
    if (this.onlySchema) {
      this.toastNotificationsService.showNotification(ToastVariant.INFO, {message: this.messagesStrings.infoAboutClearColor});
    }
  }

  public getPDF(): void {
    setTimeout(() => this.loadingService.setProgress(40), 10);
    this.savePdfFile(this.onlySchema ? this.resetColorInImage(this.clearedElement) : this.clearedElement);
  }

  public getImage() {
    this.saveImageFile(this.onlySchema ? this.resetColorInImage(this.clearedElement) : this.clearedElement);
  }

  private savePdfFile(elem: HTMLElement): void {
    setTimeout(() => this.loadingService.setProgress(45), 10);
    const tmpPdf = new jsPDF(this.sizes.orientation, 'mm', this.coreService.paperVariant(), false);
    svg2pdf(elem, tmpPdf, {
      x: 0,
      y: 0,
      width: this.sizes.width,
      height: this.sizes.height,
    }).then((value) => {
      setTimeout(() => this.loadingService.setProgress(100), 10);
      setTimeout(() => {
        this.loadingService.setProgress(0);
        value.save(`${this.autoName}.pdf`);
        this.toastNotificationsService.showNotification(ToastVariant.SUCCESS, {message: this.messagesStrings.savePdfFileSuccessful});
        this.activateZoom();
      }, 500);
    });
  }

  private saveImageFile(elem: HTMLElement): void {
    setTimeout(() => this.loadingService.setProgress(45), 10);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    Canvg.from(ctx, new XMLSerializer().serializeToString(elem)).then((instance) => {
      instance.start();
      instance.screen.ctx.save();

      const a = document.createElement('a');
      a.setAttribute('download', `${this.autoName}.png`);
      a.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
      a.setAttribute('target', '_blank');

      this.toastNotificationsService.showNotification(ToastVariant.SUCCESS, {message: this.messagesStrings.saveImageFileSuccessful});
      setTimeout(() => this.loadingService.setProgress(100), 10);
      setTimeout(() => {
        this.loadingService.setProgress(0);
        a.click();
        this.activateZoom();
      }, 500);
    }).catch((e) => {
      setTimeout(() => this.loadingService.setProgress(0), 10);
      this.activateZoom();
      this.toastNotificationsService.showNotification(ToastVariant.ERROR, {
        message: this.messagesStrings.saveImageFileError,
        summary: e
      });
    });
  }

  private resetColorInImage(mandala: any): any {
    for (let i = 0; i < mandala.childNodes[0].childNodes.length; i++) {
      if (mandala.childNodes[0].childNodes[i].tagName === 'polygon') {
        mandala.childNodes[0].childNodes[i].attributes.fill.value = '#ffffff';
      }
    }
    this.toastNotificationsService.showNotification(ToastVariant.SUCCESS, {message: this.messagesStrings.resetColorSuccessful});
    return mandala;
  }

  private activateZoom(): void {
    this.coreService.createZoomSVG(document.getElementById('svgImg2'));
  }
}
