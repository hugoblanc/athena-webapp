import { NgModule } from '@angular/core';
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
  ]
})
export class PodcastModule { }
