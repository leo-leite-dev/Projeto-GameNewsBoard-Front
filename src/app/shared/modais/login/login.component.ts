import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, retry, timer, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FaIconComponent } from '../../components/icons/fa-icon/fa-icon.component';
import { ErrorHandlingService } from '../../services/commons/error-handling.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    GenericModule,
    ReactiveFormsModule,
    InputComponent,
    FaIconComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  form: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.errorMessage = '';

    try {
      const res = await firstValueFrom(this.authService.login({ username, password }));

      this.toastr.success(res.message);

      const user = await firstValueFrom(
        this.userService.getAuthenticatedUserSafe().pipe(
          retry({
            count: 5,
            delay: () => timer(200),
          }),
          catchError(err => {
            console.error('[Login] Erro ao buscar usuário autenticado:', err);
            return of(null);
          })
        )
      );

      if (user?.username) {
        this.userService.refreshUser();
        this.loginSuccess.emit();
        this.close.emit();
      } else {
        console.warn('[Login] Usuário retornado está vazio ou inválido.');
      }

    } catch (err) {
      const detail = this.errorHandler.handleWithLog(err, 'Login');
      this.errorMessage = detail;
      this.toastr.error(detail);
    }
  }

  navigateToRegister(event: MouseEvent): void {
    event.stopPropagation();
    this.switchToRegister.emit();
  }
}