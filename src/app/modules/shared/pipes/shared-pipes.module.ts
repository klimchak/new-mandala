import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RemoveHtmlPipe} from './remove-html/remove-html.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [RemoveHtmlPipe],
  exports: [RemoveHtmlPipe],
  providers: [RemoveHtmlPipe]
})
export class SharedPipesModule {
}
