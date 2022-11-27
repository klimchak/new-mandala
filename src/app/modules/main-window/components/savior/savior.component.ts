import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ElectronService} from '../../../../core/services';
import {
  DBCallbackAbbreviated,
  MandalaModel,
  MandalaModelDB,
  MandalaModelUtility,
  MandalaTableModelClass,
  selectTableRows
} from '../../../shared/models/mandala.model';
import {get, isDate, isEmpty, unionBy} from 'lodash';
import {TableConfigModel} from '../../../shared/models/tableTypes';
import {EDITOR_MODULES} from '../../../shared/constants';
import {$animations} from '../../../shared/animations/animations';
import {Table} from 'primeng/table';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationDialogComponent} from '../../../shared/modals/confirmation-dialog/confirmation-dialog.component';
import {ApplicationOptionModel} from '../../../shared/models/application-option.model';
import {NoRemandType} from '../../../shared/models/confirm-popup.model';
import {CoreService} from '../../../shared/services/core/core.service';
import {ToastNotificationsService} from '../../../shared/services/toast-notifications/toast-notifications.service';
import {AdvancedPreviewComponent} from "../modals/advanced-preview/advanced-preview.component";

@Component({
  selector: 'app-savior',
  templateUrl: './savior.component.html',
  styleUrls: ['./savior.component.scss'],
  providers: [ElectronService],
  animations: [$animations]
})
export class SaviorComponent implements OnInit {
  @Output() public setRestoredView: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mandalas: MandalaTableModelClass[] = [];
  public tableConfig: TableConfigModel = {
    header: [
      {title: 'Имя', columnName: 'firstName', dataField: 'firstName'},
      {title: 'Фамилия', columnName: 'lastName', dataField: 'lastName'},
      {title: 'Отчество', columnName: 'patronymic', dataField: 'patronymic'},
      {title: 'Дата создания', columnName: 'createDate', dataField: 'createDate'},
      {title: 'Используемое слово', columnName: 'word', dataField: 'word'},
      {title: 'Описание', columnName: 'description', dataField: 'description'},
      {title: '', columnName: 'actions', dataField: 'actions'}
    ],
    globalFilter: ['firstName', 'lastName', 'patronymic', 'createDate', 'description']
  };
  public editorModules = EDITOR_MODULES;
  public selectedItems: MandalaTableModelClass[] = [];
  public selectedItemsContextMenu: MandalaTableModelClass;
  public selectedItemsEventValue = false;
  public contextMenuOptions = [
    {label: 'Расширенный просмотр', icon: 'pi pi-fw pi-search', command: () => this.openFullViewMandala(unionBy([this.selectedItemsContextMenu], this.selectedItems, 'id'))},
    {label: 'Открыть в редакторе', icon: 'pi pi-fw pi-palette', command: () => this.openInEditor()},
    {
      label: 'Удалить', icon: 'pi pi-fw pi-times', command: () => {
        this.onDeleteItems(unionBy([this.selectedItemsContextMenu], this.selectedItems, 'id'), true);
      }
    }
  ];

  constructor(
    private dialogService: DialogService,
    private coreService: CoreService,
    private electronService: ElectronService<MandalaModelDB>,
    private toastNotificationsService: ToastNotificationsService
  ) {
  }

  public get baseNotEmpty(): boolean {
    return !isEmpty(this.mandalas);
  }

  public get totalCounts(): number {
    return this.baseNotEmpty ? this.mandalas.length : 0;
  }

  public get emptyStyles(): string {
    if (!this.baseNotEmpty) {
      return 'c-prime__table-empty';
    }
  }

  public ngOnInit(): void {
    this.getDataForTable();
  }

  public selectedItemsEvent(): void {
    this.selectedItemsEventValue = !this.selectedItemsEventValue;
  }

  public itemIsDate(item: MandalaTableModelClass, field: string): boolean {
    return isDate(get(item, field));
  }

  public getValueFromEvent(event: Event): any {
    return get(event.target, 'value');
  }

  public isDateField(item: string): boolean {
    return item.toLowerCase().includes('date');
  }

  public onClearGlobalTableFilter(table: Table): void {
    table.clear();
  }

  public onRowEditSave(editedMandala: MandalaTableModelClass, index: number): void {
    if (this.coreService.applicationOption.noRemandDelete) {
      this.updateItem(editedMandala, index);
    } else {
      this.dialogService.open(ConfirmationDialogComponent, {
        data: {
          headerText: 'Данные будут перезаписаны, продолжить?',
          acceptText: true,
          noRemandAgain: true,
          noRemandType: NoRemandType.EDIT_ITEM,
          removeLatestVersion: false,
        }
      }).onClose.subscribe((data) => {
        if (data?.answer) {
          this.updateItem(editedMandala, index);
          if (data?.noRemandAgain) {
            this.updateNoRemandOptions({noRemandEdit: true});
          }
        }
      });
    }
  }

  public getDataForTable(): void {
    this.electronService.getDataFromDatabase<DBCallbackAbbreviated>('mandala', 'id', 'personalInfo', 'source')
      .then((value) => this.setDataForTable(value))
      .catch((e) => console.log(e));
  }

  public onDeleteItem(deletedMandala: MandalaTableModelClass, index: number): void {
    if (this.coreService.applicationOption.noRemandDelete) {
      this.deleteItem(deletedMandala, index);
    } else {
      this.dialogService.open(ConfirmationDialogComponent, {
        data: {
          headerText: 'Запись будет удалена без возможности восстановления, удалить запись?',
          acceptText: true,
          noRemandAgain: true,
          noRemandType: NoRemandType.DELETE_ITEM,
          removeLatestVersion: false,
        }
      }).onClose.subscribe((data) => {
        if (data?.answer) {
          this.deleteItem(deletedMandala, index);
          if (data?.noRemandAgain) {
            this.updateNoRemandOptions({noRemandDelete: true});
          }
        }
      });
    }
  }


  public onDeleteItems(items = this.selectedItems, fromContextMenu = false): void {
    this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        headerText: 'Записи будут удалены без возможности восстановления, удалить выбранные записи?',
        acceptText: true,
        noRemandAgain: false,
        removeLatestVersion: false,
      }
    }).onClose.subscribe((data) => {
      if (data?.answer) {
        items.forEach((item, index) => {
          this.deleteItem(item);
          if (fromContextMenu) {
            this.selectedItemsContextMenu = null;
          }
        });
      }
    });
  }

  public openInEditor(deletedMandala = this.selectedItemsContextMenu): void {
    this.electronService.getDataFromDatabaseWithFilter<MandalaModel>(
      'mandala',
      deletedMandala.id,
      'id', 'createDate', 'personalInfo', 'rayA',
      'rayB', 'rayC', 'rayA2', 'rayB2',
      'rayC2', 'imageData', 'source', 'drawForBase',
      'gridThisFigure', 'drawThisFigure', 'mandalaParamsObj').then((item) => {
      const restoredMandala = new MandalaModelUtility(this.coreService, item[0]);
      restoredMandala.setMandalaModel();
      this.setRestoredView.emit(true);
    });
  }

  private setCurrentDataInModelMandala(editedMandala: MandalaTableModelClass): void {
    this.coreService.modelMandala.personalInfo = {
      firstName: editedMandala.firstName,
      lastName: editedMandala.lastName,
      patronymic: editedMandala.patronymic,
      description: editedMandala.description,
      createDate: editedMandala.createDate,
    };
  }

  private updateItem(editedMandala: MandalaTableModelClass, index: number): void {
    const editedMandalaDb: MandalaModelDB = editedMandala.getDataForDB();
    this.electronService.updateRecordInDatabase<MandalaModelDB>('mandala', editedMandala.id, editedMandalaDb, selectTableRows)
      .then((value) => {
        if (editedMandala.id.toString() === this.coreService.modelMandala.id.toString()) {
          this.setCurrentDataInModelMandala(editedMandala);
        } else {
          this.getDataForTable();
        }
      })
      .catch((e) => console.log(e));
  }

  private deleteItem(deletedMandala: MandalaTableModelClass, index?: number): void {
    this.electronService.deleteRecordInDatabase('mandala', 'id', deletedMandala.id)
      .then((value) => {
        this.selectedItems = [];
        if (this.coreService.modelMandala?.id && deletedMandala.id.toString() === this.coreService.modelMandala.id.toString()) {
          this.coreService.modelMandala.id = null;
        }
        if (typeof index !== 'undefined') {
          this.mandalas.splice(index, 1);
        } else {
          this.getDataForTable();
        }
      })
      .catch((e) => console.log(e));
  }

  private updateNoRemandOptions(options: ApplicationOptionModel): void {
    this.electronService.updateRecordInDatabase<ApplicationOptionModel>('applicationOptions', 1, options)
      .then((value) => {
        this.electronService.getDataFromDatabase<ApplicationOptionModel>(
          'applicationOptions',
          'id', 'noRemandDelete', 'noRemandEdit', 'noRemandUpdate').then((item) => {
          this.coreService.applicationOption = {
            noRemandDelete: Boolean(item[item.length - 1].noRemandDelete),
            noRemandUpdate: Boolean(item[item.length - 1].noRemandUpdate),
            noRemandEdit: Boolean(item[item.length - 1].noRemandEdit),
          };
        });
      })
      .catch((e) => console.log(e));
  }

  private setDataForTable(value: DBCallbackAbbreviated[]): void {
    this.mandalas = [];
    value.forEach((item) => this.mandalas.push(new MandalaTableModelClass(item.id, item.personalInfo, item.source)));
  }

  private openFullViewMandala(items = this.selectedItems): void {
    let id = null;
    items.forEach((item) => id = item.id);
    this.dialogService.open(AdvancedPreviewComponent, {data: {id}});
  }
}
