import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationsRoutingModule } from './informations-routing.module';
import { InformationsComponent } from './informations.component';


@NgModule({
  declarations: [
    InformationsComponent
  ],
  imports: [
    CommonModule,
    InformationsRoutingModule
  ]
})
export class InformationsModule { }
