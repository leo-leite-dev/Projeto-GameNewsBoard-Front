import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, retry, timer, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    GenericModule,
    ReactiveFormsModule,
    InputComponent,
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
  errorMessage = '';

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
            delay: () => timer(200)
          }),
          catchError(() => of(null))
        )
      );

      if (user?.username) {
        this.userService.refreshUser(); 
        this.loginSuccess.emit();
        this.close.emit();
      } else {
        this.toastr.error('Não foi possível confirmar o login. Tente novamente.');
      }

    } catch (err) {
      this.errorMessage = 'Usuário ou senha inválidos';
      this.toastr.error(this.errorMessage);
    }
  }

  navigateToRegister(event: MouseEvent): void {
    event.stopPropagation();
    this.switchToRegister.emit();
  }
}
