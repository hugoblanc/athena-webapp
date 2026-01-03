import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastRoutingModule } from './podcast-routing.module';
import { PodcastComponent } from './podcast.component';
import { FormatTimePipe } from './pipes/format-time.pipe';

@NgModule({
  declarations: [
    PodcastComponent
  ],
  imports: [
    CommonModule,
    PodcastRoutingModule,
    FormatTimePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PodcastModule { }
