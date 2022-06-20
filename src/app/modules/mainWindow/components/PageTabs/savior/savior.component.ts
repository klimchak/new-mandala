import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../../../core/services';
import {DatabaseMandalaMadel} from '../../../../shared/models/database.madel';
import {DBCallbackAbbreviated, MandalaModel, MandalaTableModelClass} from '../../../../shared/models/mandala.model';
import {isDate, isEmpty} from 'lodash';
import {TableConfigModel} from '../../../../shared/models/tableTypes';
import {EDITOR_MODULES} from '../../../../shared/constants';

@Component({
  selector: 'app-savior',
  templateUrl: './savior.component.html',
  styleUrls: ['./savior.component.scss'],
  providers: [ElectronService]
})
export class SaviorComponent implements OnInit {
  public mandalas: MandalaTableModelClass[] = [];
  public tableConfig: TableConfigModel = {
    header: [
      {title: 'Имя', columnName: 'firstName', dataField: 'firstName'},
      {title: 'Фамилия', columnName: 'lastName', dataField: 'lastName'},
      {title: 'Отчество', columnName: 'patronymic', dataField: 'patronymic'},
      {title: 'Дата создания', columnName: 'createDate', dataField: 'createDate'},
      {title: 'Описание', columnName: 'description', dataField: 'description'},
      {title: '', columnName: 'actions', dataField: 'actions'}
    ]
  };
  public editorModules = EDITOR_MODULES;

  constructor(
    private electronService: ElectronService<DatabaseMandalaMadel>
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
    this.electronService.getDataFromDatabase<DBCallbackAbbreviated>('mandala', 'id', 'personalInfo', 'source')
      .then((value) => {
        console.log('########', value)
        value.forEach((item) => this.mandalas.push(new MandalaTableModelClass(item.id, item.personalInfo, item.source)));
      })
      .catch((e) => console.log(e));
  }

  public itemIsDate(item: any): boolean {
    return isDate(item);
  }

  public onRowEditInit(editedMandala: MandalaModel): void {
    // this.clonedProducts[product.id] = {...product};
  }

  public onRowEditSave(editedMandala: MandalaModel): void {
    // if (product.price > 0) {
    // delete this.clonedProducts[product.id];
    // this.messageService.add({severity:'success', summary: 'Success', detail:'Product is updated'});
    // }
    // else {
    // this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Price'});
    // }
  }

  public onRowEditCancel(editedMandala: MandalaModel, index: number): void {
    // this.products2[index] = this.clonedProducts[product.id];
    // delete this.clonedProducts[product.id];
  }
}
