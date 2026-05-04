import { Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../../core/auth/services/student.service';
import { TeacherService } from '../../../core/auth/services/teacher.service';
import { Studentinfo } from '../../../core/models/studentinfo.interface';
import { Teacherinfo } from '../../../core/models/teacherinfo.interface';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly teacherService = inject(TeacherService);
  private readonly router = inject(Router);
  userId: string = localStorage.getItem('ExamuserId') ?? '';
  userRole: string = localStorage.getItem('Examrole') ?? '';
  studentInfo: Studentinfo | null = null;
  teacherInfo: Teacherinfo | null = null;

  ngOnInit(): void {
    if (this.userRole === 'Teacher') {
      this.getTeacherInfo();
    } else if (this.userRole === 'Student') {
      this.getStudentInfo();
    }
  }

  get fullName(): string {
    const profile = this.teacherInfo ?? this.studentInfo;
    if (!profile) {
      return 'Welcome back';
    }

    return `${profile.firstName} ${profile.lastName}`;
  }

  get avatarPath(): string {
    return this.userRole === 'Teacher'
      ? '/Images/TeacherProfile.jpg'
      : '/Images/StudentProfile.jpg';
  }

  get roleLabel(): string {
    return this.userRole || 'User';
  }

  get baseRoute(): string {
    return this.userRole === 'Teacher' ? '/teacher' : '/student';
  }

  getStudentInfo() {
    this.studentService.getStudentInfo(this.userId).subscribe({
      next: (res) => {
        this.studentInfo = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTeacherInfo() {
    this.teacherService.getTeacherInfo(this.userId).subscribe({
      next: (res) => {
        this.teacherInfo = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout() {
    localStorage.removeItem('Examtoken');
    localStorage.removeItem('Examrole');
    localStorage.removeItem('ExamuserId');
    this.router.navigate(['/login']);
  }
}
