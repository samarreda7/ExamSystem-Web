import { Component, inject, NgZone, OnInit } from '@angular/core';
import { SubjectService } from '../../../core/auth/services/subject.service';
import { Subject } from '../../../core/models/subject.interface';

@Component({
  selector: 'app-teacher-register',
  templateUrl: './teacher-register.component.html',
  styleUrl: './teacher-register.component.css',
})
export class TeacherRegisterComponent implements OnInit {
  private readonly subjectService = inject(SubjectService);

  subjectlist: Subject[] = [];

  ngOnInit(): void {
    this.getAllSubjects();
  }

  getAllSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (res: Subject[]) => {
       this.subjectlist = res;
      },
      error: (err) => console.log(err),
    });
  }
}