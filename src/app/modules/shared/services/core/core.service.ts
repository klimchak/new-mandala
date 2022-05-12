import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {MandalaParams} from "../../models/MandalaParams";
import {ModelMandala} from "../../models/modelMandala";
import {cloneDeep} from "lodash";
import {DefaultModel} from "../../../../constants";
import * as svgPanZoom from 'svg-pan-zoom';

@Injectable({providedIn: 'root'})
export class CoreService {
  public mandalaParams: Subject<MandalaParams> = new Subject<MandalaParams>();
  public mandalaCreated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public dataPolygonMap: Map<string, number> = new Map<string, number>();
  public dataTextMap: Map<string, number> = new Map<string, number>();
  public sectorMap: Map<number, string> = new Map<number, string>();
  public activeZoom: boolean = true;
  public panZoom: any;

  public set modelMandala(data: ModelMandala) {
    this.mandala = data;
  }

  public get modelMandala(): ModelMandala {
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

  private mandala: ModelMandala;
  private polygon: any;
  private imageData: string = '';

  constructor() {
    this.modelMandala = cloneDeep(DefaultModel);
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
      beforeZoom: function(){},
      onZoom: function(){},
      beforePan: function(){},
      onPan: function(){},
      onUpdatedCTM: function(){},
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
}
