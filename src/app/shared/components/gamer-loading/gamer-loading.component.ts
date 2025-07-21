import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gamer-loading',
  standalone: true,
  templateUrl: './gamer-loading.component.html',
  styleUrls: ['./gamer-loading.component.scss']
})
export class GamerLoadingComponent {
  @Input() text: string = 'Carregando jogos';
}
