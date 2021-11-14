import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { InfoTileComponent } from './info-tile/info-tile.component';

@NgModule({
  declarations: [
    InfoTileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    InfoTileComponent
  ]
})
export class WidgetModule {
}
