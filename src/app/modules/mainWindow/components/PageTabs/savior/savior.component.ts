import {Component, OnInit} from '@angular/core';
import {IpcService} from "../../../../shared/services/core/ipc.service";
@Component({
  selector: 'app-savior',
  templateUrl: './savior.component.html',
  styleUrls: ['./savior.component.scss'],
  providers: [IpcService]
})
export class SaviorComponent implements OnInit {
  constructor(
    private tewst: IpcService
  ) {
  }

  //
  public ngOnInit(): void {
    this.tewst.test();
  }

}
