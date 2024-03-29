import {Component, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CoreService} from '../../../../shared/services/core/core.service';
import {CallbackAnyReturn} from '../../../../shared/models/callback-any-return.model';
import {FormControl, FormGroup} from '@angular/forms';
import {MandalaModel} from '../../../../shared/models/mandala.model';
import {CheckedColor} from '../../../../shared/models/checked-color.model';
import {$animations} from '../../../../shared/animations/animations';
import {MovingDialogComponent} from '../../../../shared/modals/moving-dialog/moving-dialog.component';

@Component({
  selector: 'app-colored-modal',
  templateUrl: './colored-modal.component.html',
  styleUrls: ['./colored-modal.component.scss'],
  animations: $animations,
})
export class ColoredModalComponent extends MovingDialogComponent implements OnInit {
  @ViewChild('fileInput') public fileInput: any;
  public modalForm: FormGroup;

  public get targetData(): any {
    return this.dynamicDialogConfig.data.blockData;
  }

  public get imageIsUploaded(): boolean {
    return Boolean(this.rendererService.image);
  }

  public get image(): string {
    return this.rendererService.image;
  }

  public get activeZoom(): boolean {
    return this.rendererService.activeZoom;
  }

  public get modelMandala(): MandalaModel {
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
    private dynamicDialogConfig: DynamicDialogConfig,
    private rendererService: CoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.addMovingForDialog();
    this.polygonObj = this.targetData;
    this.modalForm = new FormGroup({
      onlyOneRecolor: new FormControl(false),
      simpleColorInput: new FormControl('')
    });
  }

  public uploadImage(): void {
    this.fileInput.nativeElement.click();
  }

  public setColor(event: CheckedColor): void {
    this.recolorHexagons(event);
  }

  public onSelectFile(event: any): void {
    const file = event.target.files[0];
    this.fileReader(file, (e) => this.rendererService.image = e);
  }

  public onSelectColor(): void {
    if (this.modalForm.get('simpleColorInput')?.value) {
      this.recolorHexagons({hex: this.modalForm.get('simpleColorInput')?.value, rgb: ''});
    }
  }

  private fileReader(file: Blob, callback: CallbackAnyReturn): void {
    const reader = new FileReader();
    let result;
    reader.onload = function(e) {
      // @ts-ignore
      result = e.target.result;
      callback(result);
    };
    reader.readAsDataURL(file);
  }

  private recolorHexagons(data: CheckedColor): void {
    const dataForRecolor: any = this.modelMandala.source.drawThisFigure.node.children[0].children;
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
