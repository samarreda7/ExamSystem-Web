import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import {
  AuthService,
  CurrentUserProfile,
} from '../../core/auth/services/auth.service';
import { UpdateUser } from '../../core/models/update-user.interface';
import { UserInfo } from '../../core/models/user-info.interface';

@Component({
  selector: 'app-update-user',
  imports: [ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent implements OnInit {
  private readonly authService = inject(AuthService);

  updateUserSubscribe: Subscription = new Subscription();
  profileSubscribe: Subscription = new Subscription();
  isSubmitting = false;

  updateUserForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?[0-9]{10,15}$/),
    ]),
  });

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.patchUserForm(currentUser);
      return;
    }

    this.loadCurrentUserProfile();
  }

  patchUserForm(user: CurrentUserProfile): void {
    this.updateUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
    });
  }

  loadCurrentUserProfile(): void {
    this.profileSubscribe.unsubscribe();

    this.profileSubscribe = this.authService.getMeInfo().subscribe({
      next: (res: UserInfo) => {
        this.authService.setCurrentUser(res);
        this.patchUserForm(res);
      },
      error: () => {},
    });
  }

  onSubmit() {
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.updateUserSubscribe.unsubscribe();

    const data: UpdateUser = this.updateUserForm.value as UpdateUser;

    this.updateUserSubscribe = this.authService.UpdateUser(data).subscribe({
      next: () => {
        this.isSubmitting = false;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.authService.setCurrentUser({
            ...currentUser,
            ...data,
          });
        }

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Data updated successfully',
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          background: '#1a2236',
          color: '#e2f5ef',
          iconColor: '#1d9e75',
          customClass: { popup: 'dark-popup' },
        });
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
