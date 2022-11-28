import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loader/loader.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  public progressValue: Observable<number>;

  constructor(private loadingService: LoadingService) {
  }

  public ngOnInit(): void {
    this.progressValue = this.loadingService.getValueProgress();
  }

}
