import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationsRoutingModule } from './informations-routing.module';
import { InformationsComponent } from './informations.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InformationsComponent
  ],
  imports: [
    CommonModule,
    InformationsRoutingModule,
    SharedModule
  ]
})
export class InformationsModule { }
