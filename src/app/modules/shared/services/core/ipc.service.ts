import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable()
export class IpcService {
  private _ipc: IpcRenderer;

  constructor() {
    try {
      this._ipc = window.require('electron').ipcRenderer;
    } catch (e) {
      throw e;
    }
    // if (window.require) {
    //   try {
    //     this._ipc = window.require('electron').ipcRenderer;
    //   } catch (e) {
    //     throw e;
    //   }
    // } else {
    //   console.warn('Electron\'s IPC was not loaded');
    // }
  }

  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }
  public test(): void {
    // @ts-ignore
    this._ipc.send('mainWindowLoaded');
    // @ts-ignore
    this._ipc.on('resultSent', (data) => {
      console.log('listener ipcRendere', data);
    })
  }
  public send(channel: string, ...args: any[]): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }

}
