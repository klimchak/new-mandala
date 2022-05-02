import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  public get headerText(): string {
    return this.dialogConfig.data?.headerText ?? '';
  }

  public get acceptText(): boolean {
    return this.dialogConfig.data?.acceptText;
  }

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  public close(confirm?: boolean): void {
    this.dialogRef.close(confirm);
  }
}
