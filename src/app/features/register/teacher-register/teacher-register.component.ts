import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SubjectService } from '../../../core/auth/services/subject.service';
import { Subject } from '../../../core/models/subject.interface';
import { Teacher } from '../../../core/models/teacher.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-register',
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-register.component.html',
  styleUrl: './teacher-register.component.css',
})
export class TeacherRegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly subjectService = inject(SubjectService);
  private readonly router = inject(Router);
  subjectlist: Subject[] = [];
  registerSubscribe: Subscription = new Subscription();

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
      subjectId: new FormControl('', Validators.required),
    },
    { validators: [this.confirmpassword] },
  );

  ngOnInit(): void {
    this.getAllSubjects();
  }

  confirmpassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  getAllSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (res: Subject[]) => {
        this.subjectlist = res;
      },
      error: () => {},
    });
  }

  onSubmit() {
    if (this.registerform.valid) {
      this.registerSubscribe.unsubscribe();
      const teacherData = this.registerform.value as Teacher & { rePassword?: string };
      delete teacherData.rePassword;
      this.registerSubscribe = this.authService.signUpTeacher(teacherData).subscribe({
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
