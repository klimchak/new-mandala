import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Tab} from 'src/app/constants';
import {DialogService} from "primeng/dynamicdialog";
import {PopupCallbackModel} from "../../../shared/models/popupCallbackModel";
import {ParamsComponent} from "./modals/params/params.component";
import {MandalaParams} from "../../../shared/models/MandalaParams";
import {CoreService} from "../../../shared/services/core/core.service";
import {SaveImageModalComponent} from "./modals/save-image-modal/save-image-modal.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-page-tabs',
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageTabsComponent{
  @Input() public openTab = Tab.Notes;
  public mandalaParams!: MandalaParams;

  public get mandalaCreated(): BehaviorSubject<boolean> {
    return this.rendererService.mandalaCreated;
  }

  public get activeZoom(): boolean {
    return this.rendererService.activeZoom;
  }

  public set activeZoom(value) {
    this.rendererService.activeZoom = value;
  }

  constructor(
    private dialogService: DialogService,
    private rendererService: CoreService
  ) {
  }

  public openParams(): void {
    this.dialogService
      .open(ParamsComponent, {data: {mandalaParams: this.mandalaParams}})
      .onClose.subscribe((popupCallback: PopupCallbackModel) => {
      if (popupCallback?.changed) {
        this.mandalaParams = popupCallback.body;
        this.rendererService.mandalaParams.next(popupCallback.body);
      }
    });
  }

  public openSaveImageModal(): void {
    this.dialogService.open(SaveImageModalComponent, {data: {headerText: ``}})
      .onClose.subscribe((data) => {
      console.log(data)
    });
  }

  public switchZoom(): void {
    this.activeZoom ? this.rendererService.enableZoomSVG() : this.rendererService.disableZoomSVG();
  }
}
