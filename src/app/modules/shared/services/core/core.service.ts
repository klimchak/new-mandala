import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {MandalaParamsModel} from '../../models/mandala-params.model';
import {MandalaModel, PaperOptions} from '../../models/mandala.model';
import {cloneDeep} from 'lodash';
import {defaultModel, MandalaVariant, PaperSize} from '../../../../constants';
import * as svgPanZoom from 'svg-pan-zoom';
import {ApplicationOptionModel} from '../../models/application-option.model';

@Injectable({providedIn: 'root'})
export class CoreService {
  public mandalaIsRestored = false;
  public applicationOption: ApplicationOptionModel = {};
  public restoreMandala: Subject<boolean> = new Subject<boolean>();
  public mandalaParams: Subject<MandalaParamsModel> = new Subject<MandalaParamsModel>();
  public mandalaParamsObj: MandalaParamsModel | undefined;
  public mandalaCreated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public dataPolygonMap: Map<string, number> = new Map<string, number>();
  public dataTextMap: Map<string, number> = new Map<string, number>();
  public sectorMap: Map<number, string> = new Map<number, string>();
  public activeZoom = true;
  public activeShadowText = false;
  public panZoom: SvgPanZoom.Instance;

  private mandala: MandalaModel;
  private polygon: any;
  private imageData = '';
  constructor() {
    this.modelMandala = cloneDeep(defaultModel);
  }

  public set modelMandala(data: MandalaModel) {
    this.mandala = data;
  }

  public get modelMandala(): MandalaModel {
    return this.mandala;
  }

  public set polygonObj(data: any) {
    this.polygon = data;
  }

  public get polygonObj(): any {
    return this.polygon;
  }

  public get image(): string {
    return this.imageData;
  }

  public set image(data: string) {
    this.imageData = data;
  }

  public isDoubleString(value?: boolean): string{
    if (typeof value === 'undefined'){
      value = this.mandalaParamsObj?.double;
    }
    return value ? '_Удвоенная' : '_Без_удвоен';
  }

  public isAbbreviationString(value?: boolean): string{
    if (typeof value === 'undefined'){
      value = this.mandalaParamsObj?.abbreviation;
    }
    return value ? '_Сокращенная' : '_Без_сокращ';
  }

  public isLandscapeString(value?: boolean): string{
    if (typeof value === 'undefined'){
      value = this.mandalaParamsObj?.landscape;
    }
    return value ? '_Альбомная' : '_Портретная';
  }

  public paperVariant(value?: PaperSize): string {
    if (typeof value === 'undefined'){
      value = this.mandalaParamsObj?.paperVariant;
    }
    switch (value) {
      case PaperSize.A4:
        return 'a4';
      case PaperSize.A3:
        return 'a3';
      case PaperSize.A2:
        return 'a2';
      case PaperSize.A1:
        return 'a1';
      default:
        return 'a4';
    }
  }

  public mandalaVariantString(value?: MandalaVariant): string{
    if (typeof value === 'undefined'){
      value = this.mandalaParamsObj?.generationVariant;
    }
    switch (value) {
      case MandalaVariant.LIGHT_FROM_CENTER_MAND:
        return '_ЛУЧ_от_центра';
      case MandalaVariant.LIGHT_IN_CENTER_MAND:
        return '_ЛУЧ_к_центру';
      case MandalaVariant.LIGHT_FROM_CENTER_LIGHT:
        return '_ЛУЧ_от_центра';
      case MandalaVariant.LIGHT_IN_CENTER_LIGHT:
        return '_ЛУЧ_к_центру';
      case MandalaVariant.MARGIN_FROM_CENTER_TO_APEX:
        return '_ГРАНЬ_от_центра';
      case MandalaVariant.MARGIN_FROM_APEX_TO_CENTER:
        return '_ГРАНЬ_к_центру';
    }
  }

  public replacePtToMm(valuePT: number): number{
    return valuePT / 2.834645669313658;
  }

  public createZoomSVG(element: HTMLElement): void {
    this.panZoom = svgPanZoom(element, {
      panEnabled: true,
      controlIconsEnabled: true,
      zoomEnabled: true,
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.5,
      maxZoom: 10,
      fit: true,
      contain: true,
      center: true,
      refreshRate: 'auto',
      beforeZoom(){},
      onZoom(){},
      beforePan(){},
      onPan(){},
      onUpdatedCTM(){},
    });
    this.activeZoom ? this.enableZoomSVG() : this.disableZoomSVG();
  }

  public enableZoomSVG(): void {
    this.panZoom.enableZoom();
    this.panZoom.enableControlIcons();
  }

  public disableZoomSVG(): void {
    this.resetZoomSVG();
    this.panZoom.disableZoom();
    this.panZoom.disableControlIcons();
  }

  public resetZoomSVG(): void {
    this.panZoom.resetZoom();
  }

  public removeZoomSVG(): void {
    this.panZoom.disablePan();
    this.panZoom.resetZoom();
    this.panZoom.disableZoom();
    this.panZoom.destroy();
  }

  public getPaperSize(): PaperOptions {
    if (this.mandalaParamsObj.landscape) {
      switch (this.mandalaParamsObj.paperVariant) {
        case 1:
          return {width: 297, height: 210, orientation: 'landscape'};
        case 2:
          return {width: 420, height: 297, orientation: 'landscape'};
        case 3:
          return {width: 594, height: 420, orientation: 'landscape'};
        case 4:
          return {width: 841, height: 594, orientation: 'landscape'};
        default:
          return {width: 297, height: 210, orientation: 'landscape'};
      }
    } else {
      switch (this.mandalaParamsObj.paperVariant) {
        case 1:
          return {height: 297, width: 210, orientation: 'portrait'};
        case 2:
          return {height: 420, width: 297, orientation: 'portrait'};
        case 3:
          return {height: 594, width: 420, orientation: 'portrait'};
        case 4:
          return {height: 841, width: 594, orientation: 'portrait'};
        default:
          return {height: 297, width: 210, orientation: 'portrait'};
      }
    }
  }
}
