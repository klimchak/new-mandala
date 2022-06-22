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

  public setProgress(value: number): void {
    this.progressState.next(value);
    if (value) {
      this.document.body.style = 'overflow: hidden;';
    } else {
      this.document.body.style = '';
    }
  }

  public setProgressMockData(value = 20, timeOut = 500, increaseBy = 500): void {
    for (let i = value; i < 101; i += 20) {
      setTimeout(() => this.setProgress(i), timeOut);
      timeOut += increaseBy;
      if (i === 100){
        setTimeout(() => this.setProgress(0), timeOut);
      }
    }
  }
}
