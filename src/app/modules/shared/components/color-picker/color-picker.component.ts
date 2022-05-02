import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CoreService} from "../../services/core/core.service";
import {CheckedColor} from "../../models/checked-color.model";


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  @Input() public showInputs: boolean = false;
  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('colorBox') public colorBox: ElementRef;
  @Output() public outputColor: EventEmitter<CheckedColor> = new EventEmitter<CheckedColor>();
  public _hexValue = '';
  public _rgbaValue = '';
  private _canvas: any | undefined;
  private _canvasContext: CanvasRenderingContext2D | undefined;
  private _imgElement: any | undefined;
  private _colbox: any | undefined;

  public get imageBase64(): string {
    return this.rendererService.image;
  }

  constructor(private rendererService: CoreService) {
  }

  public ngAfterViewInit(): void {
    this._canvas = this.canvas.nativeElement;
    this._imgElement = document.createElement("img");
    this._imgElement.crossOrigin = 'anonymous';
    this._canvasContext = this._canvas.getContext("2d");
    this.getImg(this.imageBase64);
  }

  public getImg(url: string) {
    this._colbox = this.colorBox.nativeElement;
    this._imgElement.src = url;
    // @ts-ignore
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._imgElement.onload = (() => {
      // @ts-ignore
      this._canvasContext.drawImage(this._imgElement, 0, 0, this._imgElement.width, this._imgElement.height, 0, 0, this._canvas.width, this._canvas.height)
    });
  }

  public getPixel(event: any) {
    let boundingRect = this._canvas.getBoundingClientRect();
    let x = event.clientX - boundingRect.left;
    let y = event.clientY - boundingRect.top;
    // @ts-ignore
    let px = this._canvasContext.getImageData(x, y, 1, 1);
    let data_array = px.data;
    let pixelColor = `rgba(${data_array[0]}, ${data_array[1]}, ${data_array[2]}, ${data_array[3]})`;
    this._rgbaValue = pixelColor;
    let dColor = data_array[2] + 256 * data_array[1] + 65536 * data_array[0];
    this._hexValue = `#${dColor.toString()}`;
    this._colbox.style = `background: ${pixelColor}`;
    this.outputColor.emit({rgb: this._rgbaValue, hex: this._hexValue} as CheckedColor);
  }
}
