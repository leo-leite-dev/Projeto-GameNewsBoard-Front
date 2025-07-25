import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { ToastrService } from 'ngx-toastr';
import { catchError, delayWhen, firstValueFrom, of, retry, retryWhen, take, timer } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    GenericModule,
    ReactiveFormsModule,
    InputComponent,
    GenericModule,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  form: FormGroup;
  errorMessage!: string;
  icon: IconProp = 'user';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.errorMessage = '';

    this.authService.login({ username, password }).subscribe({
      next: async (res) => {
        this.toastr.success(res.message);

        const user = await firstValueFrom(
          this.userService.getAuthenticatedUserSafe().pipe(
            retry({
              count: 5,
              delay: () => timer(200)
            }),
            catchError(() => of(null))
          )
        );

        if (user?.username) {
          this.loginSuccess.emit();
          this.close.emit();
        } else {
          this.toastr.error('Não foi possível confirmar o login. Tente novamente.');
        }
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos';
        this.toastr.error(this.errorMessage);
      },
    });
  }

  navigateToRegister(event: MouseEvent) {
    event.stopPropagation();
    this.switchToRegister.emit();
  }
}
