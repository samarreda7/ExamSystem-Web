import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GroupService } from '../../../../../core/auth/services/group.service';
import { ShowStudent } from '../../../../../core/models/show-student.interface';
import { StudentService } from '../../../../../core/auth/services/student.service';
import { AssignStudentToGroup } from '../../../../../core/models/assign-student-to-group.interface';

@Component({
  selector: 'app-studentgroup',
  imports: [CommonModule],
  templateUrl: './studentgroup.component.html',
  styleUrl: './studentgroup.component.css',
})
export class StudentgroupComponent implements OnChanges {
  private readonly groupService = inject(GroupService);
  private readonly studentService = inject(StudentService);
  @Input() groupId: string = '';
  StudentList: ShowStudent[] = [];
  isAssigned: boolean = false;
  assignedStudents: Record<string, boolean> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupId'] && this.groupId) {
      this.ShowAllStudent();
    }
  }

  ShowAllStudent() {
    this.studentService.getAllStudent().subscribe({
      next: (res) => {
        this.StudentList = res;
        this.assignedStudents = {};
        this.StudentList.forEach((student) => this.IsAssigned(student.id));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  AssignStudent(studentId: string) {
    const data: AssignStudentToGroup = {
      studentId: studentId,
      groupId: this.groupId,
    };
    this.groupService.AssignStudent(data).subscribe({
      next: (res) => {
        console.log(res);
        this.assignedStudents[studentId] = true;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  UnAssignStudent(studentId: string) {
    this.groupService.UnAssignStudent(studentId, this.groupId).subscribe({
      next: (res) => {
        console.log(res);
        this.assignedStudents[studentId] = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  IsAssigned(studentId: string) {
    this.groupService.IsStudentAssigned(studentId, this.groupId).subscribe({
      next: (res) => {
        this.isAssigned = res;
        this.assignedStudents[studentId] = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isStudentAssigned(studentId: string): boolean {
    return !!this.assignedStudents[studentId];
  }

  trackByStudentId(index: number, student: ShowStudent): string {
    return student.id || index.toString();
  }
}
