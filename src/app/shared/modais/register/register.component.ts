import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/services/auth.service';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    GenericModule,
    FaIconComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  form: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.errorMessage = '';

    this.authService.register({ username, password }).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.registerSuccess.emit();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Erro inesperado. Tente novamente.';
        this.toastr.error(this.errorMessage);
      }
    });
  }

  navigateToLogin(event: MouseEvent) {
    event.stopPropagation();
    this.switchToLogin.emit();
  }
}
