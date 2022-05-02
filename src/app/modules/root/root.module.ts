import {NgModule} from '@angular/core';
import {RootRoutingModule} from './root-routing.module';
import {RootComponent} from './root-component/root.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [RootComponent],
  imports: [CommonModule, RootRoutingModule],
  providers: [],
})
export class RootModule {
}
