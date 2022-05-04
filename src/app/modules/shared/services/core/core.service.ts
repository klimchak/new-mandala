import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {MandalaParams} from "../../models/MandalaParams";
import {ModelMandala} from "../../models/modelMandala";
import {cloneDeep} from "lodash";
import {DefaultModel} from "../../../../constants";

@Injectable({providedIn: 'root'})
export class CoreService {
  public mandalaParams: Subject<MandalaParams> = new Subject<MandalaParams>();
  public dataPolygonMap: Map<string, number> = new Map<string, number>();
  public dataTextMap: Map<string, number> = new Map<string, number>();
  public sectorMap: Map<number, string> = new Map<number, string>();
  public activeZoom: boolean = true;

  public get image(): string {
    return this.imageData;
  }

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

  public set image(data: string) {
    this.imageData = data;
  }

  private mandala: ModelMandala;
  private polygon: any;
  private imageData: string = '';

  constructor() {
    console.log('constructor CoreService')
    this.modelMandala = cloneDeep(DefaultModel);
  }
}
