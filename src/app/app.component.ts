import { Component } from '@angular/core';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'new-mandala';
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    console.log('angular is running')
    // this.primengConfig.ripple = true;
  }
}
