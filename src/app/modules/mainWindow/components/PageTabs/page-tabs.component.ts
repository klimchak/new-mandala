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
  private menuItemsStandard: MenuItem[];

  constructor(
    private dialogService: DialogService,
    private electronService: ElectronService<MandalaModel>,
    private rendererService: CoreService,
    private loadingService: LoadingService
  ) {
  }

  public get menuItems(): MenuItem[] {
    if (this.openTab === Tab.editor) {
      this.menuItemsStandard[0].label = this.startParamsButtonText;
      this.menuItemsStandard[0].icon = !this.mandalaCreated ? 'pi pi-fw pi-plus' : 'pi pi-fw pi-pencil';
      this.menuItemsStandard[0].tooltipOptions = {
        tooltipLabel: this.startParamsTooltipText,
        tooltipPosition: 'bottom'
      };
      if (this.mandalaCreated) {
        this.menuItemsStandard[1].disabled = false;
        this.menuItemsStandard[2].disabled = false;
      }
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
    this.onChangeTab(this.openTab);
    this.rendererService.mandalaCreated.pipe(takeUntil(this.destroy)).subscribe((value) => this.mandalaCreated = value);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  public switchZoom(): void {
    this.activeZoom ? this.rendererService.enableZoomSVG() : this.rendererService.disableZoomSVG();
  }


  public onChangeTab(event: number): void {
    this.openTab = event;
    switch (event) {
      case 0: {
        this.menuItemsStandard = [
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
            disabled: true,
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
        break;
      }
      case 1: {
        this.menuItemsStandard = [
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
        break;
      }
    }
  }

  private openParams(): void {
    this.dialogService
      .open(ParamsModalComponent, {data: {mandalaParams: this.mandalaParams}})
      .onClose.subscribe((popupCallback: PopupCallbackModel) => {
      if (popupCallback?.changed) {
        this.mandalaParams = popupCallback.body;
        this.rendererService.mandalaParamsObj = popupCallback.body;
        setTimeout(() => {
          this.loadingService.setProgress(5);
          this.rendererService.mandalaParams.next(popupCallback.body);
          this.activeShadowText = true;
        }, 1000);
      }
    });
  }

  private openSaveDBModal(): void {
    this.dialogService.open(SaveDbModalComponent, {data: {headerText: ``}})
      .onClose.subscribe((savedParamsData) => {
      if (savedParamsData?.body) {

        if (this.rendererService.modelMandala?.id) {

          this.rendererService.modelMandala.personalInfo = {...savedParamsData.body};
          this.dialogService.open(ConfirmationDialogComponent, {
            data: {
              headerText: 'Перезаписать мандалу или создать новую на основе этой?',
              acceptText: true,
              noRemandAgain: false,
              removeLatestVersion: false,
              footerButtonLabel: {
                confirm: 'Перезаписать',
                cancel: 'Создать новую'
              }
            }
          }).onClose.subscribe((dataConfirm) => {

            if (typeof dataConfirm !== 'undefined') {
              if (dataConfirm.answer) {

                const modelForBaseClass = new MandalaModelUtility(this.rendererService);
                this.electronService.updateRecordInDatabase<MandalaModelDB>('mandala', modelForBaseClass.databaseInterimData.id,  modelForBaseClass.paramsForCreateRecord[0])
                  .then((updatedMandala) => this.loadingService.setProgressMockData());

              } else {
                const arr = new Date(this.rendererService.modelMandala.personalInfo.createDate).toISOString().split('T');
                const arr2 = arr[1].split('.');

                this.rendererService.modelMandala.personalInfo.description = `${this.rendererService.modelMandala.personalInfo.description || ''} <b>Создана на основе мандалы ${this.rendererService.modelMandala.source.word} для ${this.rendererService.modelMandala.personalInfo.firstName} ${this.rendererService.modelMandala.personalInfo.lastName} ${arr[0]} в ${arr2[0]} </b>`;
                this.rendererService.modelMandala.id = Date.now();
                this.rendererService.modelMandala.personalInfo.createDate = new Date();
                const modelForBaseClass = new MandalaModelUtility(this.rendererService);
                this.electronService.insertRecordsInDatabase<MandalaModelDB>('mandala', modelForBaseClass.paramsForCreateRecord)
                  .then((savedMandala) => {
                    this.loadingService.setProgressMockData();
                  });
              }
            }

          });
        } else {

          this.rendererService.modelMandala.personalInfo = {...savedParamsData.body};
          this.rendererService.modelMandala.id = Date.now();
          const modelForBaseClass = new MandalaModelUtility(this.rendererService);
          const paramsForCreateRecord: MandalaModelDB[] = modelForBaseClass.paramsForCreateRecord;

          this.electronService.insertRecordsInDatabase<MandalaModelDB>('mandala', paramsForCreateRecord)
            .then((value) => {
              this.loadingService.setProgressMockData();
            });
        }
      }
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
