import {Component, ViewEncapsulation} from '@angular/core';
import {jsPDF} from 'jspdf';
import {CoreService} from '../../../../../shared/services/core/core.service';
import html2canvas from 'html2canvas';
import {FormControl, FormGroup} from '@angular/forms';
import {MandalaVariant, PaperSize} from '../../../../../../constants';
import {ALL_WORDS} from '../../../../../shared/constants';

@Component({
  selector: 'app-save-image-modal',
  templateUrl: './save-image-modal.component.html',
  styleUrls: ['./save-image-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveImageModalComponent {
  public modalForm: FormGroup;
  public activeSchema: boolean = false;
  public ALL_WORDS = ALL_WORDS;

  public get switcherSchemaTooltipText(): string {
    return this.activeSchema ? ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_SCHEMA.enable : ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_SCHEMA.disable;
  }

  public get autoName(): string {
    let version = '';
    const setAddWord = this.rendererService.mandalaParamsObj?.double ? '_Удвоенная' : '_Без_удвоен';
    const abbrMand = this.rendererService.mandalaParamsObj?.abbreviation ? '_Сокращенная' : '_Без_сокращ';
    const setAlbum = this.rendererService.mandalaParamsObj?.landscape ? '_Альбомная' : '_Портретная';
    const choicePaper = `_${this.paperVariant}`;
    switch (this.rendererService.mandalaParamsObj?.generationVariant) {
      case MandalaVariant.LIGHT_FROM_CENTER_MAND:
        version = '_ЛУЧ_от_центра'
        break;
      case MandalaVariant.LIGHT_IN_CENTER_MAND:
        version = '_ЛУЧ_к_центру'
        break;
      case MandalaVariant.LIGHT_FROM_CENTER_LIGHT:
        version = '_ЛУЧ_от_центра'
        break;
      case MandalaVariant.LIGHT_IN_CENTER_LIGHT:
        version = '_ЛУЧ_к_центру'
        break;
      case MandalaVariant.MARGIN_CENTER_APEX:
        version = '_ГРАНЬ_от_центра'
        break;
      case MandalaVariant.MARGIN_APEX_CENTER:
        version = '_ГРАНЬ_к_центру'
        break;
    }
    const schemaWord = this.modalForm.get('activeSchema')?.value ? '_Схема' : '_Цвет';
    return `${this.modalForm.get('additionalName')?.value ? this.modalForm.get('additionalName')?.value : ''}
    ${this.modalForm.get('additionalName')?.value ? '_' + this.rendererService.mandalaParamsObj?.baseWord : this.rendererService.mandalaParamsObj?.baseWord}
    ${this.modalForm.get('generationVariant')?.value ? version : ''}
    ${this.modalForm.get('double')?.value ? setAddWord : ''}
    ${this.modalForm.get('abbreviation')?.value ? abbrMand : ''}
    ${this.modalForm.get('landscape')?.value ? setAlbum : ''}
    ${this.modalForm.get('activeSchema')?.value ? schemaWord : ''}
    ${this.modalForm.get('paperVariant')?.value ? choicePaper : ''}`;
  }

  private get paperVariant(): string {
    switch (this.rendererService.mandalaParamsObj?.paperVariant) {
      case PaperSize.A4:
        return 'a4';
      case PaperSize.A3:
        return 'a3';
      case PaperSize.A2:
        return 'a2';
      case PaperSize.A1:
        return 'a1';
      default:
        return 'a4'
    }
  }

  private get additionalName(): string {
    return this.modalForm.get('additionalName')?.value;
  }

  constructor(private rendererService: CoreService) {
    this.modalForm = new FormGroup({
      additionalName: new FormControl(''),
      activeSchema: new FormControl(this.activeSchema),
      generationVariant: new FormControl(true),
      double: new FormControl(true),
      abbreviation: new FormControl(true),
      landscape: new FormControl(true),
      paperVariant: new FormControl(true),
    });
  }

  private static resetColorInImage(mandala: any): any {
    for (let i = 0; i < mandala.childNodes[0].childNodes[0].childNodes.length; i++) {
      if (mandala.childNodes[0].childNodes[0].childNodes[i].tagName === 'polygon') {
        mandala.childNodes[0].childNodes[0].childNodes[i].attributes.fill.value = '#ffffff';
      }
    }
    return mandala;
  }

  public getPDF(): void {
    const data: any = document.getElementById('renderContainer');
    this.modalForm.get('activeSchema')?.value ? this.getPdf(SaveImageModalComponent.resetColorInImage(data)) : this.getPdf(data);
  }

  public getImage() {
    const data: any = document.getElementById('renderContainer');
    this.modalForm.get('activeSchema')?.value ? this.getPNG(SaveImageModalComponent.resetColorInImage(data)) : this.getPNG(data);
  }

  public getPdf(mandala: HTMLElement) {
    html2canvas(mandala).then((canvas) => {
      let PDF = new jsPDF({
        orientation: this.rendererService.mandalaParamsObj?.landscape ? 'l' : 'p',
        unit: 'px',
        format: this.paperVariant,
        hotfixes: ['px_scaling']
      });
      PDF.addImage(canvas.toDataURL('image/webp'), 'WEBP', 0, 0, canvas.width, canvas.height);
      PDF.save(`${this.autoName}.pdf`);
    }).catch((error) => console.warn(error));
  }

  public getPNG(mandala: any) {
    html2canvas(mandala).then((canvas) => {
      const name = this.autoName;
      canvas.toBlob(function (blob) {
        const newImg = document.createElement("img"),
          url = URL.createObjectURL(blob);
        newImg.onload = function () {
          URL.revokeObjectURL(url);
        };
        newImg.src = url;
        const a = document.createElement('a');
        a.setAttribute('download', `${name}.jpg`);
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.click();
      }, "image/jpeg", 1)
    }).catch((error) => console.warn(error));
  }
}
