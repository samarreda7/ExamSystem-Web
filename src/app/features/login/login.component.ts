import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { Login } from '../../core/models/login.interface';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loginSubscribe: Subscription = new Subscription();

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSubscribe.unsubscribe();
      const loginData = this.loginForm.value;
      this.loginSubscribe = this.authService.signIn(loginData).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.setItem('Examtoken', res.token);
          localStorage.setItem('Examrole', res.role);
          localStorage.setItem('ExamuserId', res.userId);
          if (res.role === 'Student') {
            this.router.navigate(['/student/home']);
          } else if (res.role === 'Teacher') {
            this.router.navigate(['/teacher/home']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
