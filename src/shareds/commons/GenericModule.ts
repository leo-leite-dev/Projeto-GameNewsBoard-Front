import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, FontAwesomeModule],
  exports: [CommonModule, IonicModule, FormsModule, FontAwesomeModule],
})
export class GenericModule { }