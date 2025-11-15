import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';
import { SharedModule } from '../../shared/shared.module';
import { contentServiceProvider } from '../../core/services/content/content.service.provider';

@NgModule({
  declarations: [
    MediaComponent
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
    SharedModule
  ],
  providers: [
    contentServiceProvider
  ]
})
export class MediaModule { }
