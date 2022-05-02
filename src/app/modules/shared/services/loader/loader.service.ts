import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // @ts-ignore
  constructor(@Inject(DOCUMENT) private document) {
  }

  public getValue(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  public changeLoadingState(isLoading: boolean): void {
    this.loadingState.next(isLoading);
    if (isLoading) {
      this.document.body.style = 'overflow: hidden;';
    } else {
      this.document.body.style = '';
    }
  }
}
