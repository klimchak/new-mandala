import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {Knex} from 'knex';
import * as path from 'path';
import {dataTablePath} from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  knex: Knex;
  path: typeof path;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
      this.knex = window.require('knex')({
        client: 'sqlite3',
        connection: {
          filename: path.join(__dirname, dataTablePath)
        }
      });
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  /**
   * @param eventName {string}
   */
  public sentEvent(eventName: string): void {
    this.ipcRenderer.send(eventName);
  }

  /**
   * @param eventName {string}
   */
  public getEvent(eventName: string): any {
    this.ipcRenderer.on(eventName, (...args) => args);
  }

  /**
   * @param tableName {string}
   * @param args {string, string, ... .etc}
   */
  public getDataFromDatabase(tableName: string, ...args): Promise<any> {
    return this.knex.select(args).from(tableName);
  }

  /**
   * @param tableName {string}
   * @param data {Array[Object1{anyName: string}, Object2{anyName: string}, ... .etc ]}
   * @param returnPosition { Array[stringA, stringB ... .etc]}
   */
  public insertRecordsInDatabase(tableName: string, data: Array<any>, returnPosition?: Array<string>): Promise<any> {
    return this.knex(tableName).insert(data, returnPosition);
  }

  /**
   * @param tableName {string}
   * @param id {number}
   * @param data {object{anyName: string}}
   * @param returnPosition {Array[stringA, stringB ... .etc]}
   */
  public updateRecordInDatabase(tableName: string, id, data: object, returnPosition?: Array<string>): Promise<any> {
    return this.knex(tableName).where({id}).update(data, returnPosition);
  }

  /**
   * @param tableName {string}
   * @param columnTitle {string}
   * @param value {string}
   */
  public deleteRecordInDatabase(tableName: string, columnTitle: string, value: string): Promise<any> {
    return this.knex(tableName).where(columnTitle, value).del();
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
