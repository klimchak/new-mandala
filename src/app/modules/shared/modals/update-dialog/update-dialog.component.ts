import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {MovingDialogComponent} from '../moving-dialog/moving-dialog.component';
import {ElectronService} from '../../../../core/services';

@Component({
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateDialogComponent extends MovingDialogComponent implements OnInit {
  public message: string;
  public restart: boolean;

  constructor(
    private dialogRef: DynamicDialogRef,
    private electronService: ElectronService<any>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.electronService.messageForUpdate.subscribe((value) => {
      this.message = value.message;
      this.restart = value.restart;
    });
    this.addMovingForDialog();
  }

  public close(): void {
    this.electronService.restartApp();
    this.dialogRef.close();
  }
}
