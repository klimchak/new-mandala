import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../../../core/services';

@Component({
  selector: 'app-savior',
  templateUrl: './savior.component.html',
  styleUrls: ['./savior.component.scss'],
  providers: [ElectronService]
})
export class SaviorComponent implements OnInit {
  constructor(
    private electronService: ElectronService
  ) {
  }

  //
  public ngOnInit(): void {
    this.electronService.sentEvent('mainWindowLoaded');
    this.electronService.ipcRenderer.on('resultSent', (evt, result) => {
      console.log('Полученные данные')
      console.log(evt)
      console.log(result)
    });
  }

}
