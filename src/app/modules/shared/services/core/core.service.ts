import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {MandalaParams} from "../../models/MandalaParams";
import {ModelMandala} from "../../models/modelMandala";
import {cloneDeep} from "lodash";
import {DefaultModel} from "../../../../constants";

@Injectable()
export class CoreService {
  public mandalaParams: Subject<MandalaParams> = new Subject<MandalaParams>();

  public get image(): string {
    return this.imageData;
  }

  public set modelMandala(data: ModelMandala) {
    this.mandala = data;
  }

  public get modelMandala(): ModelMandala {
    return this.mandala;
  }

  public set image(data: string) {
    this.imageData = data;
  }

  private mandala: ModelMandala;
  private imageData: string = '';

  constructor() {
    this.modelMandala = cloneDeep(DefaultModel);
  }
}
