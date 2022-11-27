import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MandalaModel, MandalaModelDB} from "../../../../shared/models/mandala.model";
import {ElectronService} from "../../../../../core/services";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CoreService} from "../../../../shared/services/core/core.service";
import {get} from "lodash";
import * as svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-advanced-preview',
  templateUrl: './advanced-preview.component.html',
  styleUrls: ['./advanced-preview.component.scss']
})
export class AdvancedPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer') svgContainer: ElementRef | undefined;

  private get id(): number {
    return this.dynamicDialogConfig.data.id;
  }

  private panZoom: SvgPanZoom.Instance;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private electronService: ElectronService<MandalaModelDB>,
    private coreService: CoreService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  public ngOnInit(): void {
    if (this.id) {
      this.openInEditor(this.id);
    }
  }

  public ngOnDestroy(): void {
    if (typeof this.panZoom !== 'undefined') {
      this.panZoom.disableZoom();
      this.panZoom.disableControlIcons();
      this.panZoom.destroy();
    }
  }

  public openInEditor(id: number): void {
    this.electronService.getDataFromDatabaseWithFilter<MandalaModel>(
      'mandala',
      id,
      'id', 'createDate', 'personalInfo', 'rayA',
      'rayB', 'rayC', 'rayA2', 'rayB2',
      'rayC2', 'imageData', 'source', 'drawForBase',
      'gridThisFigure', 'drawThisFigure', 'mandalaParamsObj').then((item) => {
      this.svgContainer.nativeElement.innerHTML = get(item[0], 'drawThisFigure').replace('svgImg2', 'svgImgADV');
      let a = document.getElementById('svgImgADV');
      a.style.height = '100%';
      a.style.width = '100%';
      this.createZoom(a as HTMLElement);
      this.changeDetectorRef.detectChanges();
    });
  }

  private createZoom(element: HTMLElement): void {
    this.panZoom = svgPanZoom(element, {
      panEnabled: true,
      controlIconsEnabled: true,
      zoomEnabled: true,
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 10,
      fit: true,
      contain: true,
      center: true,
      refreshRate: 'auto',
      beforeZoom() {},
      onZoom() {},
      beforePan() {},
      onPan() {},
      onUpdatedCTM() {},
    });
    this.panZoom.enableZoom();
    this.panZoom.enableControlIcons();
  }
}
