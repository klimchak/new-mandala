import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame, shell} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {Knex} from 'knex';
import * as path from 'path';
import {dataTablePath} from '../../../constants';
import {ElectronMessage} from '../../../modules/shared/models/electron-message';
import {SessionModel} from '../../../modules/shared/models/session.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService<TData> {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  knex: Knex;
  path: typeof path;
  electronShell: typeof shell;

  public session: SessionModel = {
    id: null,
    sessionStart: null,
    sessionStop: null
  };

  public messageForUpdate: BehaviorSubject<{ message: string; restart: boolean }> = new BehaviorSubject<{ message: string; restart: boolean }>({
    message: 'Доступно новое обновление',
    restart: false
  });

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;

      this.webFrame = window.require('electron').webFrame;
      this.electronShell = window.require('electron').shell;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.createConnection();
      // this.knex = window.require('knex')({
      //   client: 'sqlite3',
      //   connection: {
      //     filename: path.join(__dirname, dataTablePath),
      //   },
      //   useNullAsDefault: true
      // });
    }
  }

  public get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public get isKnex(): boolean {
    return typeof this.knex !== 'undefined';
  }

  public openAppFolder(): void{
    // this.electronShell.showItemInFolder('');
    this.electronShell.openPath('');
  }

  public createConnection(): void {
    this.knex = window.require('knex')({
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, dataTablePath),
      },
      useNullAsDefault: true
    });
  }

  public restartApp() {
    this.ipcRenderer.send('restart_app');
  }

  /**
   * @param eventName {string}
   * @param params {ElectronMessage | Object | null}
   */
  public sentEvent(eventName: string, params?: ElectronMessage | any): any {
    this.ipcRenderer.send(eventName, params);
    // this.ipcRenderer.invoke(eventName, params);
    // this.ipcRenderer.on(eventName, (...args) => args);
  }

  /**
   * @param eventName {string}
   */
  public getEvent(eventName: string): any {
    this.ipcRenderer.on(eventName, (...args) => args);
  }

  /**
   * @param filePath {string}
   */
  public removeFile(filePath: string): any {
    this.fs.rmdirSync(filePath);
  }

  /**
   * @param filePath {string}
   */
  public readeFile(filePath: string): any {
    return this.fs.readFileSync(filePath, {encoding: 'utf-8'})
  }

  /**
   * @param filePath {string}
   */
  public clearFile(filePath: string): any {
    return this.fs.appendFileSync(filePath, '');
  }

  /**
   * @param filePath {string}
   * @param data {severity: string; message: string; summary?: string;}
   */
  public addRowMessageLogInFile(filePath: string, data: {severity: string; summary: string; detail?: string;}): any {
    return this.fs.appendFileSync(filePath, JSON.stringify(data) + '\r\n');
  }

  /**
   * @param tableName {string}
   * @param args {string, string, ... .etc}
   */
  public getDataFromDatabase<TCallBackData>(tableName: string, ...args): Promise<Array<TCallBackData>> {
    return this.knex.select(args).from(tableName) as Promise<Array<TCallBackData>>;
  }

  /**
   * @param tableName {string}
   * @param args {string, string, ... .etc}
   */
  public getLastRowDataFromDatabase<TCallBackData>(tableName: string, orderBy: string,  ...args): Promise<Array<TCallBackData>> {
    return this.knex.select(args).from(tableName).orderBy(orderBy, 'desc').limit(1) as Promise<Array<TCallBackData>>;
  }


  /**
   * @param tableName {string}
   * @param id {number}
   * @param args {string, string, ... .etc}
   */
  public getDataFromDatabaseWithFilter<TCallBackData>(tableName: string, id: number, ...args): Promise<Array<TCallBackData>> {
    return this.knex(tableName).where({id}).select(args) as Promise<Array<TCallBackData>>;
  }

  /**
   * @param tableName {string}
   * @param data {Array[Object1{anyName: string}, Object2{anyName: string}, ... .etc ]}
   * @param returnPosition { Array[stringA, stringB ... .etc]}
   */
  public insertRecordsInDatabase<TDBModel>(tableName: string, data: Array<TDBModel>, returnPosition?: Array<string>): Promise<TData> {
    return this.knex(tableName).insert(data, returnPosition) as Promise<TData>;
  }

  /**
   * @param tableName {string}
   * @param id {number}
   * @param data {object{anyName: string}}
   * @param returnPosition {Array[stringA, stringB ... .etc]}
   */
  public updateRecordInDatabase<TDBModel>(tableName: string, id: number, data: TDBModel, returnPosition?: Array<string>): Promise<TData> {
    return this.knex(tableName).where({id}).update(data, returnPosition) as Promise<TData>;
  }

  /**
   * @param tableName {string}
   * @param columnTitle {string}
   * @param value {string}
   */
  public deleteRecordInDatabase(tableName: string, columnTitle: string, value: string | number | Date): Promise<TData> {
    return this.knex(tableName).where(columnTitle, value).del() as Promise<TData>;
  }

  /**
   * @param tableName {string}
   */
  public hasTableExist(tableName: string): Promise<any> {
    return this.knex.schema.hasTable(tableName);
  }

  /**
   * @param tableName {string}
   * @param instance {(t: Knex.CreateTableBuilder) => {
   *      (t) => {
   *        t.increments('id').primary();
   *        t.string('first_name', 100);
   *        t.string('last_name', 100);
   *        t.text('bio');
   *      }
   * }}
   */
  public createTable(tableName: string, instance: (data: Knex.CreateTableBuilder) => void): Promise<any> {
    return this.knex.schema.createTable('users', instance);
  }

  /**
   * @param tableName {string}
   */
  public dropTable(tableName: string): Promise<any> {
    return this.knex.schema.dropTable(tableName);
  }

}
