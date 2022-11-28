import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from './root-component/root.component';
import {NotFoundComponent} from "../shared/components/notFoundComponent/notFound.component";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'mainWindow',
        loadChildren: () => import('../main-window/main-window.module').then((m) => m.MainWindowModule),
      },
      {
        path: '',
        redirectTo: '/mainWindow',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {
}
