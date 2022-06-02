import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [DetailComponent],
    imports: [CommonModule, DetailRoutingModule, TranslateModule]
})
export class DetailModule {}
