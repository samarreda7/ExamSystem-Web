import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../../../core/auth/services/group.service';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { TeacherService } from '../../../../core/auth/services/teacher.service';
import { Teacherinfo } from '../../../../core/models/teacherinfo.interface';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly examService = inject(ExamService);
  private readonly teacherService = inject(TeacherService);
  userId: string = localStorage.getItem('ExamuserId') ?? '';
  examcount: number = 0;
  groupcount: number = 0;
  teacherInfo: Teacherinfo | null = null;

  ngOnInit(): void {
    this.getTeacherExamCount();
    this.getTeacherGroupCount();
    this.getTeacherInfo();
  }

  get teacherFirstName(): string {
    return this.teacherInfo?.firstName || 'Teacher';
  }

  getTeacherExamCount() {
    this.examService.getTeacherExamCount().subscribe({
      next: (res) => {
        this.examcount = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTeacherGroupCount() {
    this.groupService.getTeacherGroupsCount().subscribe({
      next: (res) => {
        this.groupcount = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTeacherInfo() {
    if (!this.userId) {
      return;
    }

    this.teacherService.getTeacherInfo(this.userId).subscribe({
      next: (res) => {
        this.teacherInfo = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
