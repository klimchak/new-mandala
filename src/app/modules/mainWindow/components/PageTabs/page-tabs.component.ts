import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {PopupCallbackModel} from '../../../shared/models/popup-callback.model';
import {ParamsModalComponent} from './modals/params-modal/params-modal.component';
import {CoreService} from '../../../shared/services/core/core.service';
import {SaveImageModalComponent} from './modals/save-image-modal/save-image-modal.component';
import {Subject, takeUntil} from 'rxjs';
import {ALL_WORDS} from '../../../shared/constants';
import {MenuItem} from 'primeng/api';
import {SaveDbModalComponent} from './modals/save-db-modal/save-db-modal.component';
import {Tab} from '../../../../constants';
import {MandalaModel, MandalaModelDB, MandalaModelUtility} from '../../../shared/models/mandala.model';
import {ElectronService} from '../../../../core/services';
import {LoadingService} from '../../../shared/services/loader/loader.service';
import {ConfirmationDialogComponent} from '../../../shared/modals/confirmation-dialog/confirmation-dialog.component';
import {MandalaParamsModel} from '../../../shared/models/mandala-params.model';

@Component({
  selector: 'app-page-tabs',
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageTabsComponent implements OnInit, OnDestroy {
  public openTab = Tab.editor;
  public mandalaParams!: MandalaParamsModel;
  public mandalaCreated = false;
  public ALL_WORDS = ALL_WORDS;

  private destroy: Subject<boolean> = new Subject<boolean>();
  private menuItemsStandard: MenuItem[] = [
    {
      label: ALL_WORDS.BUTTON.HEADER.menu.menu_model.create,
      icon: 'pi pi-fw pi-plus',
      command: () => this.openParams()
    },
    {
      label: ALL_WORDS.BUTTON.HEADER.menu.menu_model.export,
      icon: 'pi pi-fw pi-external-link',
      disabled: true,
      tooltipOptions: {
        tooltipLabel: ALL_WORDS.TOOLTIP.TOOLTIP_HEADER_MENU.export,
        tooltipPosition: 'bottom'
      },
      command: () => this.openSaveImageModal()
    },
    {
      label: ALL_WORDS.BUTTON.HEADER.menu.menu_model.saveDB,
      icon: 'pi pi-fw pi-calendar-times',
      tooltipOptions: {
        tooltipLabel: ALL_WORDS.TOOLTIP.TOOLTIP_HEADER_MENU.saveDB,
        tooltipPosition: 'bottom'
      },
      command: () => this.openSaveDBModal()
    },
    {separator: true},
    {
      label: ALL_WORDS.BUTTON.HEADER.menu.menu_model.quit,
      icon: 'pi pi-fw pi-power-off',
      tooltipOptions: {
        tooltipLabel: ALL_WORDS.TOOLTIP.TOOLTIP_HEADER_MENU.quit,
        tooltipPosition: 'bottom'
      },
      command: () => this.closeProgram()
    }
  ];

  constructor(
    private dialogService: DialogService,
    private electronService: ElectronService<MandalaModel>,
    private rendererService: CoreService,
    private loadingService: LoadingService
  ) {
  }

  public get menuItems(): MenuItem[] {
    this.menuItemsStandard[0].label = this.startParamsButtonText;
    this.menuItemsStandard[0].icon = !this.mandalaCreated ? 'pi pi-fw pi-plus' : 'pi pi-fw pi-pencil';
    this.menuItemsStandard[0].tooltipOptions = {
      tooltipLabel: this.startParamsTooltipText,
      tooltipPosition: 'bottom'
    };
    if (this.mandalaCreated) {
      this.menuItemsStandard[1].disabled = false;
    }
    return this.menuItemsStandard;
  }

  public get activeZoom(): boolean {
    return this.rendererService.activeZoom;
  }

  public set activeZoom(value) {
    this.rendererService.activeZoom = value;
  }

  public get activeShadowText(): boolean {
    return this.rendererService.activeShadowText;
  }

  public set activeShadowText(value) {
    this.rendererService.activeShadowText = value;
  }

  public get startParamsTooltipText(): string {
    return this.mandalaCreated ? ALL_WORDS.TOOLTIP.TOOLTIP_HEADER_MENU.edit : ALL_WORDS.TOOLTIP.TOOLTIP_HEADER_MENU.create;
  }

  public get startParamsButtonText(): string {
    return this.mandalaCreated ? ALL_WORDS.BUTTON.HEADER.start_params.enable : ALL_WORDS.BUTTON.HEADER.start_params.disable;
  }

  public get switcherZoomTooltipText(): string {
    return this.activeZoom ? ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_ZOOM.enable : ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_ZOOM.disable;
  }

  public get switcherShadowHelpTextTooltipText(): string {
    return this.activeZoom ? ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_HELP_TEXT.enable : ALL_WORDS.TOOLTIP.TOOLTIP_SWITCHER_HELP_TEXT.disable;
  }

  public ngOnInit(): void {
    this.rendererService.mandalaCreated.pipe(takeUntil(this.destroy)).subscribe((value) => this.mandalaCreated = value);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  public switchZoom(): void {
    this.activeZoom ? this.rendererService.enableZoomSVG() : this.rendererService.disableZoomSVG();
  }

  private openParams(): void {
    this.dialogService
      .open(ParamsModalComponent, {data: {mandalaParams: this.mandalaParams}})
      .onClose.subscribe((popupCallback: PopupCallbackModel) => {
      if (popupCallback?.changed) {
        this.mandalaParams = popupCallback.body;
        this.rendererService.mandalaParamsObj = popupCallback.body;
        this.rendererService.mandalaParams.next(popupCallback.body);
        this.activeShadowText = true;
      }
    });
  }

  private openSaveDBModal(): void {
    this.dialogService.open(SaveDbModalComponent, {data: {headerText: ``}})
      .onClose.subscribe((data) => {
      this.rendererService.modelMandala.personalInfo = {...data.body};
      const modelForBaseClass = new MandalaModelUtility(
        this.rendererService, {
          mandala: this.rendererService.modelMandala,
          mandalaParamsObj: this.rendererService.mandalaParamsObj
        }
      );
      const paramsForCreateRecord: MandalaModelDB[] = modelForBaseClass.paramsForCreateRecord;
      this.electronService.insertRecordsInDatabase<MandalaModelDB>('mandala', paramsForCreateRecord).then((value) => {
        this.loadingService.setProgressMockData();
        console.log('record is inserted', value);
      });
    });
  }

  private openSaveImageModal(): void {
    this.dialogService.open(SaveImageModalComponent, {data: {headerText: ``}})
      .onClose.subscribe((data) => {
      console.log(data);
    });
  }

  private closeProgram(): void {
    this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        headerText: 'Все несохраненные данные будут утеряны, выйти из программы?',
        acceptText: true,
        noRemandAgain: false,
        removeLatestVersion: false,
      }
    }).onClose.subscribe((data) => this.electronService.ipcRenderer.send('quitApp', data?.answer));
  }
}
