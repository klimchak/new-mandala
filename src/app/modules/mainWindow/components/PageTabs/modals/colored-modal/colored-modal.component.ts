import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CoreService} from "../../../../../shared/services/core/core.service";
import {CallbackAnyReturn} from "../../../../../shared/models/callback-any-return.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ModelMandala} from "../../../../../shared/models/modelMandala";
import {CheckedColor} from "../../../../../shared/models/checked-color.model";

@Component({
  selector: 'app-colored-modal',
  templateUrl: './colored-modal.component.html',
  styleUrls: ['./colored-modal.component.scss']
})
export class ColoredModalComponent implements OnInit {
  public modalForm: FormGroup;
  public get targetData(): any {
    return this.dynamicDialogConfig.data.blockData;
  }

  public get imageIsUploaded(): boolean {
    return !!this.rendererService.image;
  }

  public get image(): string {
    return this.rendererService.image;
  }

  public get activeZoom(): boolean {
    return this.rendererService.activeZoom;
  }

  public get modelMandala(): ModelMandala {
    return this.rendererService.modelMandala;
  }

  public get polygonObj(): any {
    return this.rendererService.polygonObj;
  }

  public set polygonObj(data: any) {
    this.rendererService.polygonObj = data;
  }

  public get individualRecolor(): boolean {
    return this.modalForm.get('onlyOneRecolor')?.value;
  }

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private rendererService: CoreService
  ) {
  }

  ngOnInit(): void {
    this.polygonObj = this.targetData;
    console.log(this.targetData)
    this.modalForm = new FormGroup({
      onlyOneRecolor: new FormControl('')
    });
  }

  public setColor(event: CheckedColor): void {
    this.recolorHexagons(event)
  }

  public onSelectFile(event: any): void {
    let file = event.target.files[0]
    this.fileReader(file, (e) => this.rendererService.image = e)
  }

  private fileReader(file: Blob, callback: CallbackAnyReturn): void {
    let reader = new FileReader();
    let result;
    reader.onload = function (e) {
      // @ts-ignore
      result = e.target.result;
      callback(result)
    };
    reader.readAsDataURL(file);
  }

  private recolorHexagons(data: CheckedColor): void{
    const dataForRecolor: any = this.activeZoom ?
      this.modelMandala.source.drawThisFigure.node.children[0].children :
      this.modelMandala.source.drawThisFigure.node.children ;
    if (!this.individualRecolor) {
      for (let i = 0; i < dataForRecolor.length; i++) {
        if (dataForRecolor[i].classList[1] === this.polygonObj.classList[1]) {
          dataForRecolor[i].attributes.fill.value = data.hex;
        }
      }
    }
    // установка выбранного цвета
    this.polygonObj.attributes.fill.value = data.hex;
  }

}
