import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageTabsComponent} from "./components/page-tabs/page-tabs.component";

const routes: Routes = [{ path: '', component: PageTabsComponent}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class MainWindowRouting {
}
