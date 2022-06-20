import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SVG} from '@svgdotjs/svg.js';
import {MandalaParamsModel} from '../../../../shared/models/mandala-params.model';
import {MandalaModel} from '../../../../shared/models/mandala.model';
import {arr_ru, DefaultModel} from '../../../../../constants';
import {cloneDeep, get} from 'lodash';
import {Grid} from '../../../../shared/utils/static/BHexTs/BHex.Core';
import {CoreService} from '../../../../shared/services/core/core.service';
import {Drawing, Options, Orientation, Point} from '../../../../shared/utils/static/BHexTs/BHex.Drawing';
import {DialogService} from 'primeng/dynamicdialog';
import {ColoredModalComponent} from '../modals/colored-modal/colored-modal.component';
import {CallbackAnyReturn} from '../../../../shared/models/callback-any-return.model';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('testSvg') testSvg: ElementRef | undefined;
  public startedParams!: MandalaParamsModel;
  public showWord!: string;
  public showWordInNumbers!: string;
  public timeStart!: number;
  public timeEnd!: number;

  // public get debug(): string {
  //   return JSON.stringify(this.startedParams);
  // }

  constructor(
    private rendererService: CoreService,
    private dialogService: DialogService,
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

  private setToDefault(): void{
    this.modelMandala = cloneDeep(DefaultModel);
    this.showWord = '';
    this.showWordInNumbers = '';
    this.dataPolygonMap.clear();
    this.dataTextMap.clear();
    this.sectorMap.clear();
    this.polygonObj = {};
  }

  public ngOnInit(): void {
    this.rendererService.mandalaParams.subscribe((item) => {
      console.log(item);
      if (this.testSvg) {
        this.testSvg.nativeElement.innerHTML = '';
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
    const setAddWord = this.startedParams.double;
    const abbrMand = this.startedParams.abbreviation;
    const setAlbum = this.startedParams.landscape;
    const choicePaper = this.getPaperSize();
    this.modelMandala.source.pageSize.width = choicePaper.width;
    this.modelMandala.source.pageSize.height = choicePaper.height;
    this.modelMandala.source.rangeMm = this.startedParams.marginSize;
    this.modelMandala.source.rangeFontSize = this.startedParams.fontSize;
    this.modelMandala.source.colorWord = this.startedParams.numberColor;

    this.timeStart = Date.now();

    let strToHex = '';
    for (let i = 0; i < this.modelMandala.source.word.length; i++) {
      // @ts-ignore
      let r = arr_ru[this.modelMandala.source.word[i]];
      if (r === 10 || r === 20 || r === 30) {
        if (r === 10) {
          r = 1;
        }
        if (r === 20) {
          r = 2;
        }
        if (r === 30) {
          r = 3;
        }
      }
      strToHex += String(r);
    }
    strToHex.trim();
    let countHex = strToHex.length - 1;
    // доп параметры
    // обратный вариант
    if (this.modelMandala.source.mandalaVersion === 2 || this.modelMandala.source.mandalaVersion === 6) {
      strToHex = strToHex.split('').reverse().join('');
    }
    // от центра с удвоением
    if (this.modelMandala.source.mandalaVersion === 3 || this.modelMandala.source.mandalaVersion === 7) {
      const strB = strToHex;
      const strA = strToHex.split('').reverse().join('');
      if (abbrMand) {
        strToHex = String(strA) + String(strB).substr(1, strB.length);
      } else {
        strToHex = String(strA) + String(strB);
      }
      countHex = strToHex.length - 1;
    }
    // к центру с удвоением
    if (this.modelMandala.source.mandalaVersion === 4 || this.modelMandala.source.mandalaVersion === 8) {
      const strB = strToHex;
      const strA = strToHex.split('').reverse().join('');
      if (abbrMand) {
        strToHex = String(strB) + String(strA).substr(1, strA.length);
      } else {
        strToHex = String(strB) + String(strA);
      }
      countHex = strToHex.length - 1;
    }
    this.modelMandala.source.wordInInt = strToHex;
    this.modelMandala.source.countWord = countHex;
    this.showWord = 'Использовано слово: ' + this.modelMandala.source.word;
    this.showWordInNumbers = 'В переведенном виде: ' + strToHex;
    this.createMandala((e) => this.openColorDialog(e));
  }

  private createMandala(openColorDialog: CallbackAnyReturn): void {
    // if (document.getElementById('svgImg2') !== null) {
    //   document.getElementById('svgImg2').remove();
    //   for (let key in modelMandala) {
    //     if (key === "source") break;
    //     modelMandala[key].rayCoord = [];
    //     modelMandala[key].sector = [];
    //   }
    //   dataTextMap.clear();
    //   dataPolygonMap.clear();
    // }
    const dWith = this.modelMandala.source.pageSize.width * 3.543307;
    const dHeight = this.modelMandala.source.pageSize.height * 3.543307;
    const dRangeMm = this.modelMandala.source.rangeMm * 3.543307;
    const options = new Options(dRangeMm, Orientation.PointyTop, new Point(dWith, dHeight));
    const gridBHex = new Grid(this.modelMandala.source.countWord);
    const gridForPaint = new Drawing(gridBHex, options);
    this.modelMandala.source.gridThisFigure = gridForPaint;
    this.modelMandala.source.drawThisFigure = SVG().addTo('#renderContainer').size(dWith, dHeight).id('svgImg2');
    // document.getElementById("svgImg2").setAttribute('style', 'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd');
    const fontSize = this.modelMandala.source.rangeFontSize;
    gridForPaint.grid.hexes.forEach((item, index) => {
      this.modelMandala.source.drawThisFigure
        .polygon(item.points.map((data: {x: string; y: string}) => `${data.x},${data.y}`))
        .addClass('polygon')
        .addClass('999')
        .addClass(`${item.x},${item.y}`)
        .fill('none')
        .stroke({width: 1, color: '#000000'})
        .css({cursor: 'pointer'})
        .element('title').words(`${item.x},${item.y}`);
      this.modelMandala.source.drawThisFigure
        .text(`${item.x},${item.y}`)
        .addClass(`${item.x},${item.y}`)
        .font({
          size: fontSize,
          anchor: 'middle',
          leading: 1.4,
          fill: this.modelMandala.source.colorWord
        })
        .translate(item.center.x, item.center.y + 3);
    });

    for (let i = 0; i < this.modelMandala.source.drawThisFigure.node.children.length; i++) {
      if (this.modelMandala.source.drawThisFigure.node.children[i].tagName === 'polygon') {
        const str = this.modelMandala.source.drawThisFigure.node.children[i].classList[2];
        this.dataPolygonMap.set(str, i);
        this.modelMandala.source.drawThisFigure.node.children[i].onclick = function(e: any) {
          openColorDialog(e);
        };
      }
      if (this.modelMandala.source.drawThisFigure.node.children[i].tagName === 'text') {
        const str = this.modelMandala.source.drawThisFigure.node.children[i].classList[0];
        this.dataTextMap.set(str, i);
      }
    }
    this.modelMandala.source.drawThisFigure.viewbox(dWith / -2 + ' ' + dHeight / -2 + ' ' + dWith + ' ' + dHeight);

    this.modelMandala.source.drawForBase = new XMLSerializer().serializeToString(this.modelMandala.source.drawThisFigure.node);

    if (this.modelMandala.source.mandalaVersion === 1 || this.modelMandala.source.mandalaVersion === 2 || this.modelMandala.source.mandalaVersion === 3 || this.modelMandala.source.mandalaVersion === 4) {
      this.axialDataSet();
    }
    if (this.modelMandala.source.mandalaVersion === 5 || this.modelMandala.source.mandalaVersion === 6 || this.modelMandala.source.mandalaVersion === 7 || this.modelMandala.source.mandalaVersion === 8) {
      this.borderDataSet();
    }
  }

  private openColorDialog(event: any): void{
    this.dialogService.open(ColoredModalComponent, {data: {blockData: event.target}});
  }

  // Axis мандала
  // установка значений в класс для автовыбора при расскращивании.
  private axialDataSet(): void {
    console.log('Затрачено времени ', this.timeConversion(Date.now() - this.timeStart));
    this.getArrOnRayAndSector();
    // установка значений по осям
    let numb = 1;
    for (const key in this.modelMandala) {
      numb = 1;
      if (key === 'source') {break;}
      for (let i = 0; i < get(this.modelMandala, key).rayCoord.length; i++) {
        const obj = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).rayCoord[i][0], get(this.modelMandala, key).rayCoord[i][1], false);
        obj.classList.replace('999', String(this.modelMandala.source.wordInInt[numb]));
        obj.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
        obj.attributes.fill.value = '#ececec';
        const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).rayCoord[i][0], get(this.modelMandala, key).rayCoord[i][1], true);
        objText.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
        numb++;
      }
    }
    // установка значений по полям
    for (const key in this.modelMandala) {
      const countStep = 1;
      if (key === 'source') {break;}
      for (let i = 0; i < get(this.modelMandala, key).sector[0].length; i++) {
        for (let u = 0; u < get(this.modelMandala, key).sector[0][i].length; u++) {
          const objForChange = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], false);
          let objParent1; let objParent2;
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
    obj.attributes.fill.value = '#ececec';
    const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, true);
    objText.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[0]);
    objText.setAttribute('font-weight', '900');

    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));

    this.rendererService.mandalaCreated.next(true);
    console.warn('!!! mandalaCreated !!!');

    this.addZoomInLayout();
  }

  private addZoomInLayout(): void{
    this.rendererService.createZoomSVG(document.getElementById('svgImg2') as HTMLElement);
  }

  // border мандала
  // установка значений в класс для автовыбора при расскращивании.
  private borderDataSet(): void {
    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));
    this.getArrOnBorderAndSector();
    // установка значений по осям
    let numb = 0;
    for (const key in this.modelMandala) {
      numb = 0;
      if (key === 'source') {break;}
      for (let i = 0; i < get(this.modelMandala, key).rayCoord.length; i++) {
        const obj = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).rayCoord[i][0], get(this.modelMandala, key).rayCoord[i][1], false);
        obj.classList.replace('999', String(this.modelMandala.source.wordInInt[numb]));
        obj.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
        obj.attributes.fill.value = '#ececec';
        const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).rayCoord[i][0], get(this.modelMandala, key).rayCoord[i][1], true);
        objText.firstChild.innerHTML = String(this.modelMandala.source.wordInInt[numb]);
        this.sectorMap.set(i, String(this.modelMandala.source.wordInInt[numb]));
        numb++;
      }
    }
    // установка значений по полям
    for (const key in this.modelMandala) {
      const countStep = 1;
      if (key === 'source') {break;}
      for (let i = 0; i < get(this.modelMandala, key).sector[0].length; i++) {
        for (let u = 0; u < get(this.modelMandala, key).sector[0][i].length; u++) {
          const objForChange = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, get(this.modelMandala, key).sector[0][i][u][0], get(this.modelMandala, key).sector[0][i][u][1], false);
          let objParent1; let objParent2;
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
    let res = Number(objParent1.classList[1]) + Number(objParent2.classList[1]);
    if (res >= 10) {
      res = Number(String(res)[0]) + Number(String(res)[1]);
    }
    obj.classList.replace('999', String(res));
    obj.firstChild.innerHTML = String(res);
    obj.attributes.fill.value = '#ececec';
    const objText = this.getValOnCoordinate(this.modelMandala.source.drawThisFigure, 0, 0, true);
    objText.firstChild.innerHTML = String(res);
    objText.setAttribute('font-weight', '900');
    this.timeEnd = Date.now();
    console.log('Затрачено времени ', this.timeConversion(this.timeEnd - this.timeStart));


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
    let a = 2; let b = -1;
    let a2 = a; let b2 = b; let interimStep = step;
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
    let a = this.modelMandala.source.countWord; let b = 0;
    let a2 = a; let b2 = b; let interimStep = step;
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
      return (stage.node.children as HTMLCollection)[o];
    } else {
      const o = this.dataPolygonMap.get(strForSearch);
      // @ts-ignore
      return stage.node.children[o];
    }
  }

  private getPaperSize(): { width: number; height: number } {
    if (this.startedParams.landscape) {
      switch (this.startedParams.paperVariant) {
        case 1:
          return {width: 297, height: 210};
        case 2:
          return {width: 420, height: 297};
        case 3:
          return {width: 594, height: 420};
        case 4:
          return {width: 841, height: 594};
        default:
          return {width: 297, height: 210};
      }
    } else {
      switch (this.startedParams.paperVariant) {
        case 1:
          return {height: 297, width: 210};
        case 2:
          return {height: 420, width: 297};
        case 3:
          return {height: 594, width: 420};
        case 4:
          return {height: 841, width: 594};
        default:
          return {height: 297, width: 210};
      }
    }
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
