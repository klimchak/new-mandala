import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './modules/shared/components/notFoundComponent/notFound.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/root/root.module').then(m => m.RootModule),
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
