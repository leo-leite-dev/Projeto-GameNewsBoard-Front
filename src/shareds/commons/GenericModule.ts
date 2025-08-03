import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '../../app/shared/components/icons/fa-icon/fa-icon.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FontAwesomeModule,
    FaIconComponent
  ],
  exports: [CommonModule, IonicModule, FormsModule, FontAwesomeModule, FaIconComponent],
})
export class GenericModule { }