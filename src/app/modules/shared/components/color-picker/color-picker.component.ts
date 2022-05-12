import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CheckedColor} from "../../models/checked-color.model";
import {$animations} from "../../animations/animations";
import {FormControl, FormGroup} from "@angular/forms";
import {get} from "lodash";


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  animations: $animations,
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent implements AfterViewInit, OnChanges {
  @Input() public showInputs: boolean = false;
  @Input() public imageBase64: string = '';
  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('colorBox') public colorBox: ElementRef;
  @Output() public outputColor: EventEmitter<CheckedColor> = new EventEmitter<CheckedColor>();
  public imagePickerForm: FormGroup;
  public _hexValue = '';
  public _rgbaValue = '';
  public static _imageSize = {
    width: 500,
    height: 400,
  };
  private _canvas: any | undefined;
  private _canvasContext: CanvasRenderingContext2D | undefined;
  private _imgElement: any | undefined;
  private _colbox: any | undefined;

  public get imageWidth(): number {
    return this.imagePickerForm.get('horizontalSize')?.value;
  }

  public get imageHeight(): number {
    return this.imagePickerForm.get('verticalSize')?.value;
  }

  public get widthResizeContainer(): string {
    return `width: ${this.imagePickerForm.get('horizontalSize')?.value}px`;
  }

  public get heightResizeContainer(): string {
    return `height: ${this.imagePickerForm.get('verticalSize')?.value}px`;
  }

  constructor() {
    this.imagePickerForm = new FormGroup({
      horizontalSize: new FormControl(ColorPickerComponent._imageSize.width),
      verticalSize: new FormControl(ColorPickerComponent._imageSize.height),
    })
  }

  public static rgbToHex(r: number, g: number, b: number): string {
    return `#${ColorPickerComponent.componentToHex(r)}${ColorPickerComponent.componentToHex(g)}${ColorPickerComponent.componentToHex(b)}`;
  }

  private static componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!get(changes, 'imageBase64').firstChange) {
      this.getImg(get(changes, 'imageBase64').currentValue);
    }
  }

  public ngAfterViewInit(): void {
    this._colbox = this.colorBox.nativeElement;
    this._canvas = this.canvas.nativeElement;
    this._imgElement = document.createElement("img");
    this._imgElement.crossOrigin = 'anonymous';
    this._canvasContext = this._canvas.getContext("2d");
    if (this.imageBase64) {
      this.getImg(this.imageBase64);
    }
  }

  public resizeImageVertical(): void {
    this.getImg(this.imageBase64);
  }

  public resizeImageHorizontal(): void {
    this.getImg(this.imageBase64);
  }

  public getImg(url: string): void {
    this._imgElement.src = url;
    // @ts-ignore
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._imgElement.onload = (() => {
      // @ts-ignore
      this._canvasContext.drawImage(this._imgElement, 0, 0, this._imgElement.width, this._imgElement.height, 0, 0, this._canvas.width, this._canvas.height)
    });
  }

  public setPixelColor(event: any, withReturn = false): void {
    let boundingRect = this._canvas.getBoundingClientRect();
    let x = event.clientX - boundingRect.left;
    let y = event.clientY - boundingRect.top;
    // @ts-ignore
    let px = this._canvasContext.getImageData(x, y, 1, 1);
    let data_array = px.data;
    let pixelColor = `rgba(${data_array[0]}, ${data_array[1]}, ${data_array[2]}, ${data_array[3]})`;
    this._rgbaValue = pixelColor;
    this._hexValue = ColorPickerComponent.rgbToHex(data_array[0], data_array[1], data_array[2]);
    this._colbox.style = `background: ${pixelColor}`;
    if (withReturn) {
      this.outputColor.emit({rgb: this._rgbaValue, hex: this._hexValue} as CheckedColor);
    }
  }
}
