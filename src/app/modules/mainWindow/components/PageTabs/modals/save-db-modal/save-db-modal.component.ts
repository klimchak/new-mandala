import { Component, OnInit } from '@angular/core';
import {MovingDialogComponent} from '../../../../../shared/modals/moving-dialog/moving-dialog.component';

@Component({
  selector: 'app-save-db-modal',
  templateUrl: './save-db-modal.component.html',
  styleUrls: ['./save-db-modal.component.scss']
})
export class SaveDbModalComponent extends MovingDialogComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.addMovingForDialog();
  }

}
