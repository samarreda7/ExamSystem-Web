import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-register',
  imports: [ReactiveFormsModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css',
})
export class StudentRegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerform: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{10,15}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#!@\$%\^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', Validators.required),
    },
    { validators: [this.confirmpassword] },
  );

  confirmpassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  registerSubscribe: Subscription = new Subscription();

  onSubmit() {
    if (this.registerform.valid) {
      this.registerSubscribe.unsubscribe();
      const userData = this.registerform.value;
      delete userData.rePassword;
      this.registerSubscribe = this.authService.signUp(userData).subscribe({
        next: () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Account created successfully',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 2500,
            background: '#1a2236',
            color: '#e2f5ef',
            iconColor: '#1d9e75',
            customClass: { popup: 'dark-popup' },
          });
          this.router.navigate(['/login']);
        },
        error: () => {},
      });
    }
  }
}
