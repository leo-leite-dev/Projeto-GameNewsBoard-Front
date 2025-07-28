import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-button',
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss',
})
export class SubmitButtonComponent {
  @Input() label: string = 'Salvar';
  @Input() disabled: boolean = false;
  @Input() routeAfterSubmit?: string;

  constructor(private router: Router) { }

  onClick(): void {
    if (this.routeAfterSubmit) {
      console.log('Navegando para:', this.routeAfterSubmit);
      setTimeout(() => this.router.navigateByUrl(this.routeAfterSubmit!), 300);
    }
  }
}
