import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingService} from '../../services/loader/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  public isLoading$?: Observable<boolean>;

  constructor(private lodaingService: LoadingService) {
  }

  public ngOnInit(): void {
    this.isLoading$ = this.lodaingService.getValue();
  }
}
