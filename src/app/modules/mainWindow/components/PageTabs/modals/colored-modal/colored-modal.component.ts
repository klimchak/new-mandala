import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CoreService} from "../../../../../shared/services/core/core.service";
import {CallbackAnyReturn} from "../../../../../shared/models/callback-any-return.model";
import {FormControl, FormGroup} from "@angular/forms";
import {ModelMandala} from "../../../../../shared/models/modelMandala";

@Component({
  selector: 'app-colored-modal',
  templateUrl: './colored-modal.component.html',
  styleUrls: ['./colored-modal.component.scss']
})
export class ColoredModalComponent implements OnInit {
  public modalForm: FormGroup;
  public get targetData(): boolean {
    return this.dynamicDialogConfig.data.blockData;
  }

  public get imageIsUploaded(): boolean {
    return !!this.rendererService.image;
  }

  public get image(): string {
    return this.rendererService.image;
  }

  public get modelMandala(): ModelMandala {
    return this.rendererService.modelMandala;
  }

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private rendererService: CoreService
  ) {
  }

  ngOnInit(): void {
    this.modalForm = new FormGroup({
      onlyOneRecolor: new FormControl('')
    });
    console.log('in ColoredModalComponent: ', this.targetData);
    console.log(this.rendererService.image)
    console.log(this.modelMandala)
    // let colorPicker = new ImageColorPicker('.thumbnail img', {
    //   preview: '.preview',
    //   clicked: function (data) {
    //     if (!individualColor) {
    //       for (let i = 0; i < modelMandala.source.drawThisFigure.node.children.length; i++) {
    //         if (modelMandala.source.drawThisFigure.node.children[i].classList[1] === polygonObj.classList[1]) {
    //           modelMandala.source.drawThisFigure.node.children[i].attributes.fill.value = data.result_hex;
    //         }
    //       }
    //     }
    //     // установка выбранного цвета
    //     polygonObj.attributes.fill.value = data.result_hex;
    //   }
    // });
  }

  public setColor(event: any): void {
    console.log(event)
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

}
