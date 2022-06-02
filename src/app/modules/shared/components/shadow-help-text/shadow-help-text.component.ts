import {Component} from '@angular/core';
import {CoreService} from '../../services/core/core.service';
import {MandalaModel} from '../../models/mandala.model';
import {MandalaParamsModel} from '../../models/mandala-params.model';
import {MandalaVariant} from '../../../../constants';

@Component({
  selector: 'app-shadow-help-text',
  templateUrl: './shadow-help-text.component.html',
  styleUrls: ['./shadow-help-text.component.scss']
})
export class ShadowHelpTextComponent {

  public top: number;
  public left: number;

  public get modelMandala(): MandalaModel {
    return this.rendererService.modelMandala;
  }

  public get mandalaParamsObj(): MandalaParamsModel {
    return this.rendererService.mandalaParamsObj;
  }

  public get moveStyle(): string {
    return `top: ${this.top || 200}px; left: ${this.left || '70'}${this.left ? 'px' : '%'}`;
  }

  private layerX: number;
  private layerY: number;
  private mouseBtnIsDown: boolean = false;

  constructor(private rendererService: CoreService) {
  }

  public getMandalaVariant(variant: MandalaVariant): string {
    switch (variant) {
      case MandalaVariant.LIGHT_FROM_CENTER_MAND:
        return 'по лучу от центра мандалы';
      case MandalaVariant.LIGHT_IN_CENTER_MAND:
        return 'по лучу к центру мандалы';
      case MandalaVariant.LIGHT_FROM_CENTER_LIGHT:
        return 'по лучу от центра луча';
      case MandalaVariant.LIGHT_IN_CENTER_LIGHT:
        return 'по лучу к центру луча';
      case MandalaVariant.MARGIN_CENTER_APEX:
        return 'по грани от центра грани';
      case MandalaVariant.MARGIN_APEX_CENTER:
        return 'по грани к центру грани';
    }
  }

  public booleanConvert(data: boolean): string {
    return data ? 'Да': 'Нет';
  }

  public mouseMove(event: any): void {
    if (this.mouseBtnIsDown) {
      this.top = event.pageY - this.layerY;
      this.left = event.pageX - this.layerX;
    }
  }

  public mouseDown(event: any): void {
    this.mouseBtnIsDown = true;
    this.layerX = event.layerX;
    this.layerY = event.layerY;
  }

  public mouseUp(event: any): void {
    this.mouseBtnIsDown = false;
  }

}
