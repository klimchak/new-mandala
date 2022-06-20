import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private progressState: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // @ts-ignore
  constructor(@Inject(DOCUMENT) private document) {
  }

  public getValue(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  public getValueProgress(): Observable<number> {
    return this.progressState.asObservable();
  }

  public changeLoadingState(isLoading: boolean): void {
    this.loadingState.next(isLoading);
    if (isLoading) {
      this.document.body.style = 'overflow: hidden;';
    } else {
      this.document.body.style = '';
    }
  }

  public changeProgressState(state: number): void {
    this.progressState.next(state);
    if (state) {
      this.document.body.style = 'overflow: hidden;';
    } else {
      this.document.body.style = '';
    }
  }

  public setProgress(value: number): void {
    this.changeProgressState(value);
  }

  public setProgressMockData(value = 20, timeOut = 1000, increaseBy = 1000): void {
    for (let i = value; i < 101; i += 20) {
      setTimeout(() => this.changeProgressState(i), timeOut);
      timeOut += increaseBy;
      if (i === 100){
        setTimeout(() => this.changeProgressState(0), timeOut);
      }
    }
  }
}
