import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SVG} from '@svgdotjs/svg.js';
import {MandalaParamsModel} from '../../../shared/models/mandala-params.model';
import {MandalaModel, PaperOptions} from '../../../shared/models/mandala.model';
import {alphabet_and_number, defaultModel, MandalaVariant} from '../../../../constants';
import {cloneDeep, get} from 'lodash';
import {Axial, Grid} from '../../../shared/utils/static/BHexTs/BHex.Core';
import {CoreService} from '../../../shared/services/core/core.service';
import {Drawing, Options, Orientation, Point} from '../../../shared/utils/static/BHexTs/BHex.Drawing';
import {DialogService} from 'primeng/dynamicdialog';
import {ColoredModalComponent} from '../modals/colored-modal/colored-modal.component';
import {CallbackAnyReturn} from '../../../shared/models/callback-any-return.model';
import {LoadingService} from '../../../shared/services/loader/loader.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('svgContainer') svgContainer: ElementRef | undefined;
  public startedParams!: MandalaParamsModel;
  public showWord!: string;
  public showWordInNumbers!: string;
  public timeStart!: number;
  public timeEnd!: number;

  constructor(
    private rendererService: CoreService,
    private dialogService: DialogService,
    private loadingService: LoadingService
  ) {
  }

  public get dataPolygonMap(): Map<string, number> {
    return this.rendererService.dataPolygonMap;
  }

  public get dataTextMap(): Map<string, number> {
    return this.rendererService.dataTextMap;
  }

  public get sectorMap(): Map<number, string> {
    return this.rendererService.sectorMap;
  }

  public get modelMandala(): MandalaModel {
    return this.rendererService.modelMandala;
  }

  public set modelMandala(data: any) {
    this.rendererService.modelMandala = data;
  }

  public get polygonObj(): any {
    return this.rendererService.polygonObj;
  }

  public set polygonObj(data: any) {
    this.rendererService.polygonObj = data;
  }

  private setToDefault(): void {
    this.modelMandala = cloneDeep(defaultModel);
    this.showWord = '';
    this.showWordInNumbers = '';
    this.dataPolygonMap.clear();
    this.dataTextMap.clear();
    // this.sectorMap.clear();
    this.polygonObj = {};
  }

  public ngOnInit(): void {
    this.rendererService.restoreMandala.subscribe((value) => {
      if (value) {
        this.loadingService.setProgress(20);
        this.svgContainer.nativeElement.innerHTML = '';
        setTimeout(() => {
          this.modelMandala.source.drawThisFigure = SVG(this.modelMandala.source.drawThisFigure).addTo('#renderContainer').id('svgImg2');
          this.setEventInPolygon((e) => this.openColorDialog(e), true);
          this.addZoomInLayout();
          this.rendererService.mandalaCreated.next(true);
          this.loadingService.setProgress(100);
          setTimeout(() => {
            this.loadingService.setProgress(0);
          }, 1000);
        }, 3000);
      }
    });
    this.rendererService.mandalaParams.subscribe((item) => {
      if (typeof this.svgContainer !== 'undefined' && this.svgContainer.nativeElement.innerHTML) {
        this.svgContainer.nativeElement.innerHTML = '';
        this.setToDefault();
        this.startedParams = item;
        this.setMandalaWord();
      } else {
        this.startedParams = item;
        this.setMandalaWord();
      }
    });
  }

  public setMandalaWord(): void {
    this.modelMandala.source.word = this.startedParams.baseWord.toLowerCase();
    this.modelMandala.source.mandalaVersion = this.startedParams.generationVariant;
    const choicePaper: PaperOptions = this.rendererService.getPaperSize();
    this.modelMandala.source.pageSize.width = choicePaper.width;
    this.modelMandala.source.pageSize.height = choicePaper.height;
    this.modelMandala.source.rangeMm = this.startedParams.marginSize;
    this.modelMandala.source.strokeWidth = this.startedParams.strokeWidth || 0.5;
    this.modelMandala.source.rangeFontSize = this.rendererService.replacePtToMm(this.startedParams.fontSize);
    this.modelMandala.source.colorWord = this.startedParams.numberColor;

    this.timeStart = Date.now();

    let strToHex = '';
    // this.modelMandala.source.word.split('').forEach((item) => strToHex = `${strToHex}${this.fromDecToOne(arr_ru[item])}`); // а вот тут было добавлено перевод двухзначных цифр в одну.
    this.modelMandala.source.word.split('').forEach((item) => strToHex = `${strToHex}${alphabet_and_number[item]}`);

    strToHex.trim();
    let countHex = strToHex.length - 1;
    // доп параметры
    // обратный вариант
    if (this.modelMandala.source.mandalaVersion === MandalaVariant.LIGHT_IN_CENTER_MAND) {
      strToHex = strToHex.split('').reverse().join('');
    }
    // от центра с удвоением
    if (this.modelMandala.source.mandalaVersion === MandalaVariant.LIGHT_IN_CENTER_LIGHT || this.modelMandala.source.mandalaVersion === MandalaVariant.MARGIN_FROM_APEX_TO_CENTER) {
      if (this.startedParams.abbreviation) {
        strToHex = `${strToHex}${strToHex.substring(0, strToHex.length - 1).split('').reverse().join('')}`;
      } else {
        strToHex = `${strToHex}${strToHex.split('').reverse().join('')}`;
      }
      countHex = strToHex.length - 1;
    }
    // к центру с удвоением
    if (this.modelMandala.source.mandalaVersion === MandalaVariant.LIGHT_FROM_CENTER_LIGHT || this.modelMandala.source.mandalaVersion === MandalaVariant.MARGIN_FROM_CENTER_TO_APEX) {
      if (this.startedParams.abbreviation) {
        strToHex = `${strToHex.split('').reverse().join('').substring(0, strToHex.length - 1)}${strToHex}`;
      } else {
        strToHex = `${strToHex.split('').reverse().join('')}${strToHex}`;
      }
      countHex = strToHex.length - 1;
    }
    console.log('слово ', strToHex, 'число цифр', strToHex);
    this.modelMandala.source.wordInInt = strToHex;
    this.modelMandala.source.countWord = countHex;
    this.showWord = 'Использовано слово: ' + this.modelMandala.source.word;
    this.showWordInNumbers = 'В переведенном виде: ' + strToHex;
    setTimeout(() => this.loadingService.setProgress(5), 1);
    setTimeout(() => this.createMandala(), 1000);
  }

  private setEventInPolygon(openColorDialog: CallbackAnyReturn, restore = false): void {
    const dWith = this.modelMandala.source.pageSize.width;
    const dHeight = this.modelMandala.source.pageSize.height;
    const addedValue = (restore ? 70 : 20) / this.modelMandala.source.drawThisFigure.node.children.length;
    let addedValue2 = (restore ? 20 : 30) + addedValue;
    const restoredPath = 'source.drawThisFigure.node.children[0].children';
    const primaryPath = 'source.drawThisFigure.node.children';
    for (let i = 0; i < get(this.modelMandala, restore ? restoredPath : primaryPath).length; i++) {
      if (i !== 0) {
        addedValue2 = Math.floor(addedValue2 + addedValue);
      }
      if (get(this.modelMandala, restore ? restoredPath : primaryPath)[i].tagName === 'polygon') {
        const str = get(this.modelMandala, restore ? restoredPath : primaryPath)[i].classList[2];
        this.dataPolygonMap.set(str, i);
        get(this.modelMandala, restore ? restoredPath : primaryPath)[i].onclick = (e: any) => {
          openColorDialog(e);
        };
      }
      setTimeout(() => this.loadingService.setProgress(addedValue2), 500);
      if (get(this.modelMandala, restore ? restoredPath : primaryPath)[i].tagName === 'text') {
        const str = get(this.modelMandala, restore ? restoredPath : primaryPath)[i].classList[0];
        this.dataTextMap.set(str, i);
      }
    }
    this.modelMandala.source.drawThisFigure.viewbox(`${dWith / -2} ${dHeight / -2} ${dWith} ${dHeight}`);
  }

  private createMandala(): void {
    const dWith = this.modelMandala.source.pageSize.width;
    const dHeight = this.modelMandala.source.pageSize.height;
    const options = new Options(this.modelMandala.source.rangeMm, Orientation.PointyTop, new Point(dWith / 2, dHeight / 2));
    const gridBHex = new Grid(this.modelMandala.source.countWord);
    const gridForPaint = new Drawing(gridBHex, options);
    this.modelMandala.source.gridThisFigure = gridForPaint;
    this.modelMandala.source.drawThisFigure = SVG().size(`${this.modelMandala.source.pageSize.width}mm`, `${this.modelMandala.source.pageSize.height}mm`).id('svgImg2');
    const group = this.modelMandala.source.drawThisFigure.group()
    this.modelMandala.source.drawThisFigure.addTo('#renderContainer');
    // this.modelMandala.source.drawThisFigure.node.style.backgroundColor = '#6366F1';
    // this.modelMandala.source.drawThisFigure.node.style.border = '1px solid #fc0000';
    setTimeout(() => this.loadingService.setProgress(30), 1);

    console.log('Затрачено времени перед gridForPaint ', this.timeConversion(Date.now() - this.timeStart));
    const SIZE = 50;
    const res: any[] = gridForPaint.grid.hexes.reduce((p, c) => {
      if (p[p.length - 1].length === SIZE) {
        p.push([]);
      }
      p[p.length - 1].push(c);
      return p;
    }, [[]]);

    console.log('Затрачено времени после gridForPaint ', this.timeConversion(Date.now() - this.timeStart));
    const listDrawPolygonExec: Array<Promise<any>> = [];
    res.forEach((item) => listDrawPolygonExec.push(this.drawAllPolygon(item, group)));

    Promise.all(listDrawPolygonExec).then((value) => {
      console.log('Затрачено времени ', this.timeConversion(Date.now() - this.timeStart));
      this.setEventInPolygon((e) => this.openColorDialog(e), true);

      setTimeout(() => this.loadingService.setProgress(50), 1);
      setTimeout(() => {
        if (this.modelMandala.source.mandalaVersion === 1 || this.modelMandala.source.mandalaVersion === 2 || this.modelMandala.source.mandalaVersion === 3 || this.modelMandala.source.mandalaVersion === 4) {
          this.axialDataSet();
        }
        if (this.modelMandala.source.mandalaVersion === 5 || this.modelMandala.source.mandalaVersion === 6/* || this.modelMandala.source.mandalaVersion === 7 || this.modelMandala.source.mandalaVersion === 8*/) {
          this.borderDataSet();
        }
      }, 1000);
    });
  }

  private drawAllPolygon(axials: Axial[], groupForDraw: any): Promise<any> {
    return new Promise<any>((resolve) => {
      const allExec: Promise<any>[] = [];
      axials.forEach((item, index) => allExec.push(this.drawPolygon(item, groupForDraw)) );
      Promise.all(allExec).then((value) => resolve(value));
    });
  }

  private drawPolygon(item: Axial, groupForDraw: any): Promise<any> {
    return new Promise<any>((resolve) => {
      groupForDraw.polygon(item.points.map((data) => `${data.x},${data.y}`))
        .addClass('polygon')
        .addClass('999')
        .addClass(`${item.x},${item.y}`)
        .fill('none')
        .stroke({width: this.modelMandala.source.strokeWidth, color: '#000000'})
        .css({cursor: 'pointer'})
        .element('title').words(`${item.x},${item.y}`);
      groupForDraw.text(`${item.x},${item.y}`)
        .addClass(`${item.x},${item.y}`)
        .font({
          size: this.modelMandala.source.rangeFontSize,
          anchor: 'middle',
          leading: 1.4,
          fill: this.modelMandala.source.colorWord
        })
        .translate(item.center.x, item.center.y + 0.5);
      resolve(true);
    });
  }

  private openColorDialog(event: any): void {
    this.dialogService.open(ColoredModalComponent, {data: {blockData: event.target}, dismissableMask: true});
  }

  private setValueInRay(path: string, numb: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const rayCoord = get(this.modelMandala, path).rayCoord as any[];
      if (typeof rayCoord !== 'undefined') {
        for (let i = 0; i < rayCoord.length; i++) {
          const obj = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, rayCoord[i][0], rayCoord[i][1], false);
          obj.classList.replace('999', String(this.modelMandala.source.wordInInt[numb]));
          obj.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
          obj.attributes.fill.value = '#ffffff';
          const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, rayCoord[i][0], rayCoord[i][1], true);
          objText.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
          numb++;
        }
        resolve(true);
      } else {
        reject();
      }
    });
  }

  // Axis мандала
  // установка значений в класс для автовыбора при раскрашивании.
  private axialDataSet(): void {
    console.log('Затрачено времени ', this.timeConversion(Date.now() - this.timeStart));
    this.getArrOnRayAndSector();

    // установка значений по осям
    let numb = 1;
    setTimeout(() => this.loadingService.setProgress(70), 1);
    const listSetRayValueExec: Array<Promise<any>> = [];
    Object.keys(this.modelMandala).forEach((key) => {
      numb = 1;
      if (key !== 'source' && key !== 'id' && key !== 'personalInfo') {
        listSetRayValueExec.push(this.setValueInRay(key, numb));
      }
    });
    Promise.all(listSetRayValueExec).then((value) => {
      console.log('listSetRayValueExec', value);
    });
    setTimeout(() => this.loadingService.setProgress(80), 1);

    // установка значений по полям
    for (const key in this.modelMandala) {
      const countStep = 1;
      if (key === 'source') {
        break;
      }
      for (let i = 0; i < get(this.modelMandala, key).sector[0].length; i++) {
        for (let u = 0; u < get(this.modelMandala, key).sector[0][i].length; u++) {
          const objForChange = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], false);
          let objParent1;
          let objParent2;
          if (key === 'rayA') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1], false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
          }
          if (key === 'rayB') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
          }
          if (key === 'rayC') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1], false);
          }
          if (key === 'rayA2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1], false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
          }
          if (key === 'rayB2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
          }
          if (key === 'rayC2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1], false);
          }
          let res = Number(objParent1.classList[1]) + Number(objParent2.classList[1]);
          if (res >= 10) {
            res = Number(String(res)[0]) + Number(String(res)[1]);
          }
          objForChange.classList.replace('999', String(res));
          objForChange.firstChild.innerHTML = String(res);
          objForChange.attributes.fill.value = '#ffffff';
          const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], true);
          objText.firstChild.innerHTML = String(res);
        }
      }
    }

    // установка центрального значения
    const obj = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, false);
    obj.classList.replace('999', String(this.modelMandala.source.wordInInt[0]));
    obj.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[0]);
    obj.attributes.fill.value = '#ffffff';
    const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, true);
    objText.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[0]);
    objText.setAttribute('font-weight', '900');

    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));

    this.loadingService.setProgress(90);
    setTimeout(() => {
      this.rendererService.mandalaCreated.next(true);
      console.warn('!!! mandalaCreated !!!');
      this.addZoomInLayout();
    }, 1000);
  }

  private addZoomInLayout(): void {
    this.rendererService.createZoomSVG(document.getElementById('svgImg2') as HTMLElement);
    this.loadingService.setProgress(100);
    setTimeout(() => {
      this.loadingService.setProgress(0);
    }, 1000);
  }

  // border мандала
  // установка значений в класс для автовыбора при расскращивании.
  private borderDataSet(): void {
    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));
    setTimeout(() => this.loadingService.setProgress(55), 1);
    this.getArrOnBorderAndSector();
    setTimeout(() => this.loadingService.setProgress(60), 1);
    // установка значений по осям
    let numb = 0;
    setTimeout(() => this.loadingService.setProgress(70), 1);
    const listSetRayValueExec: Array<Promise<any>> = [];
    Object.keys(this.modelMandala).forEach((key) => {
      numb = 0;
      if (key !== 'source' && key !== 'id' && key !== 'personalInfo') {
        listSetRayValueExec.push(this.setValueInRay(key, numb));
      }
    });
    Promise.all(listSetRayValueExec).then((value) => {
      console.log('listSetRayValueExec', value);
    });
    setTimeout(() => this.loadingService.setProgress(80), 1);


    // установка значений по полям
    for (const key in this.modelMandala) {
      const countStep = 1;
      if (key === 'source') {
        break;
      }
      for (let i = 0; i < get(this.modelMandala, key).sector[0].length; i++) {
        for (let u = 0; u < get(this.modelMandala, key).sector[0][i].length; u++) {
          const objForChange = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], false);
          let objParent1;
          let objParent2;
          if (key === 'rayA') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1], false);
          }
          if (key === 'rayB') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
          }
          if (key === 'rayC') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1], false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] - 1, false);
          }
          if (key === 'rayA2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1], false);
          }
          if (key === 'rayB2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] - 1, get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
          }
          if (key === 'rayC2') {
            objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1] + 1, false);
            objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0] + 1, get(this.modelMandala, key).sector[0][i][u][1], false);
          }
          let res = Number(objParent1.classList[1]) + Number(objParent2.classList[1]);
          if (res >= 10) {
            res = Number(String(res)[0]) + Number(String(res)[1]);
          }
          objForChange.classList.replace('999', String(res));
          objForChange.firstChild.innerHTML = String(res);
          objForChange.attributes.fill.value = '#ffffff';
          const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], true);
          objText.firstChild.innerHTML = String(res);
        }
      }
    }
    // установка центрального значения
    const obj = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, false);
    const objParent1 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 1, -1, false);
    const objParent2 = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 1, 0, false);
    setTimeout(() => this.loadingService.setProgress(80), 1);
    let res = Number(objParent1.classList[1]) + Number(objParent2.classList[1]);
    if (res >= 10) {
      res = Number(String(res)[0]) + Number(String(res)[1]);
    }
    obj.classList.replace('999', String(res));
    obj.firstChild.innerHTML = String(res);
    obj.attributes.fill.value = '#ffffff';
    const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, true);
    objText.firstChild.innerHTML = String(res);
    objText.setAttribute('font-weight', '900');
    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));

    setTimeout(() => this.loadingService.setProgress(90), 1);

    console.log('!!!!!!', this.modelMandala.source.drawThisFigure)
    this.rendererService.mandalaCreated.next(true);
    this.addZoomInLayout();
  }


  /*
  * второй этап построения, после генерации сетки и отрисовки будет перебор с установкой Event
  * вызов создания модели сетки и просчет значений по заданию
  * */

  // заполнение осевой мандалы координатами
  private getArrOnRayAndSector(): void {
    let resArr = [];
    let interimArr = [];
    const step = this.modelMandala.source.countWord - 1;
    // ray A
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayA.rayCoord.push([i, 0]);
    }
    let a = 2;
    let b = -1;
    let a2 = a;
    let b2 = b;
    let interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([++a2, b2]);
      }
      a += 1;
      b -= 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayA.sector.push(resArr);
    resArr = [];

    // ray B
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayB.rayCoord.push([i, i * -1]);
    }
    a = 1;
    b = -2;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([++a2, --b2]);
      }
      a = 1;
      b -= 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayB.sector.push(resArr);
    resArr = [];

    // ray C
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayC.rayCoord.push([0, i * -1]);
    }
    a = -1;
    b = -1;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([a2, --b2]);
      }
      a -= 1;
      b = -1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayC.sector.push(resArr);
    resArr = [];

    // ray A2
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayA2.rayCoord.push([i * -1, 0]);
    }
    a = -2;
    b = 1;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([--a2, b2]);
      }
      a -= 1;
      b += 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayA2.sector.push(resArr);
    resArr = [];

    // ray B2
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayB2.rayCoord.push([i * -1, i]);
    }
    a = -1;
    b = 2;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([--a2, ++b2]);
      }
      a = -1;
      b += 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayB2.sector.push(resArr);
    resArr = [];

    // ray C2
    for (let i = 1; i <= this.modelMandala.source.countWord; i++) {
      this.modelMandala.rayC2.rayCoord.push([0, i]);
    }
    a = 1;
    b = 1;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        y === 1 ? interimArr.push([a2, b2]) : interimArr.push([a2, ++b2]);
      }
      a += 1;
      b = 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      resArr.push(interimArr);
      interimArr = [];
    }
    this.modelMandala.rayC2.sector.push(resArr);
    resArr = [];
  }


  // заполнение мандалы "по грани" координатами
  private getArrOnBorderAndSector() {
    let resArr = [];
    let interimArr = [];
    const step = this.modelMandala.source.countWord;
    // ray A
    let a = this.modelMandala.source.countWord;
    let b = 0;
    let a2 = a;
    let b2 = b;
    let interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayA.rayCoord.push([a2, b2]) : this.modelMandala.rayA.rayCoord.push([a2, --b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([a2, --b2]);
        }
      }
      a -= 1;
      b = 0;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }

    }
    this.modelMandala.rayA.sector.push(resArr);
    resArr = [];

    // ray B
    a = this.modelMandala.source.countWord;
    b = this.modelMandala.source.countWord * -1;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayB.rayCoord.push([a2, b2]) : this.modelMandala.rayB.rayCoord.push([--a2, b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([--a2, b2]);
        }
      }
      a -= 1;
      b += 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }
    }
    this.modelMandala.rayB.sector.push(resArr);
    resArr = [];

    // // ray C
    a = 0;
    b = this.modelMandala.source.countWord * -1;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayC.rayCoord.push([a2, b2]) : this.modelMandala.rayC.rayCoord.push([--a2, ++b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([--a2, ++b2]);
        }
      }
      a = 0;
      b += 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }
    }
    this.modelMandala.rayC.sector.push(resArr);
    resArr = [];

    // // ray A2
    a = this.modelMandala.source.countWord * -1;
    b = 0;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayA2.rayCoord.push([a2, b2]) : this.modelMandala.rayA2.rayCoord.push([a2, ++b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([a2, ++b2]);
        }
      }
      a += 1;
      b = 0;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }
    }
    this.modelMandala.rayA2.sector.push(resArr);
    resArr = [];

    // // ray B2
    a = this.modelMandala.source.countWord * -1;
    b = this.modelMandala.source.countWord;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayB2.rayCoord.push([a2, b2]) : this.modelMandala.rayB2.rayCoord.push([++a2, b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([++a2, b2]);
        }
      }
      a += 1;
      b -= 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }
    }
    this.modelMandala.rayB2.sector.push(resArr);
    resArr = [];

    // // ray C2
    a = 0;
    b = this.modelMandala.source.countWord;
    a2 = a;
    b2 = b;
    interimStep = step;
    for (let i = 1; i <= step; i++) {
      for (let y = 1; y <= interimStep; y++) {
        if (i === 1) {
          y === 1 ? this.modelMandala.rayC2.rayCoord.push([a2, b2]) : this.modelMandala.rayC2.rayCoord.push([++a2, --b2]);
        } else {
          y === 1 ? interimArr.push([a2, b2]) : interimArr.push([++a2, --b2]);
        }
      }
      a = 0;
      b -= 1;
      a2 = a;
      b2 = b;
      interimStep -= 1;
      if (i !== 1) {
        resArr.push(interimArr);
        interimArr = [];
      }
    }
    this.modelMandala.rayC2.sector.push(resArr);
    resArr = [];
  }


  // получение координаты из ListStyle
  private getValOnCoordinate(stage: any, o1: number, o2: number, text: boolean) {
    const strForSearch = `${o1},${o2}`;
    if (text) {
      const o = this.dataTextMap.get(strForSearch);
      // @ts-ignore
      return (stage.node.children[0].children as HTMLCollection)[o];
    } else {
      const o = this.dataPolygonMap.get(strForSearch);
      // @ts-ignore
      return stage.node.children[0].children[o];
    }
  }

  private fromDecToOne(numb: number): number {
    if (numb >= 10){
      numb = Number(String(numb)[0]) + Number(String(numb)[1]);
    }
    if (numb >= 10){
      numb = Number(String(numb)[0]) + Number(String(numb)[1]);
    }
    return numb;
  }

  private timeConversion(millisec: number) {
    const seconds = Number((millisec / 1000).toFixed(1));
    const minutes = Number((millisec / (1000 * 60)).toFixed(1));
    const hours = Number((millisec / (1000 * 60 * 60)).toFixed(1));
    const days = Number((millisec / (1000 * 60 * 60 * 24)).toFixed(1));
    if (seconds < 60) {
      return seconds + ' Sec';
    } else if (minutes < 60) {
      return minutes + ' Min';
    } else if (hours < 24) {
      return hours + ' Hrs';
    } else {
      return days + ' Days';
    }
  }
}
