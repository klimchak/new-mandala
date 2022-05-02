import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainWindowComponent} from "./components/main-window.component";

const routes: Routes = [{ path: '', component: MainWindowComponent}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class MainWindowRouting {
}
