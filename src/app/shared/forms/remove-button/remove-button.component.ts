import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';  

@Component({
  selector: 'app-remove-button',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss'],  
})
export class RemoveButtonComponent {
  @Input() tooltip = 'Remover';
  @Output() click = new EventEmitter<Event>();

  faTimes = faTimes; 

  constructor(private library: FaIconLibrary) {
    library.addIcons(faTimes); 
  }
}
