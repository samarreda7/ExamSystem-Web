import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ExamService } from '../../../../../core/auth/services/exam.service';
import { GroupService } from '../../../../../core/auth/services/group.service';
import { AssignExam } from '../../../../../core/models/assign-exam.interface';
import { Exams } from '../../../../../core/models/exams.interface';

@Component({
  selector: 'app-examgroup',
  imports: [CommonModule],
  templateUrl: './examgroup.component.html',
  styleUrl: './examgroup.component.css',
})
export class ExamgroupComponent implements OnChanges {
  private readonly groupService = inject(GroupService);
  private readonly examService = inject(ExamService);
  @Input() groupId: string = '';
  examList: Exams[] = [];
  isAssigned: boolean = false;
  assignedExams: Record<string, boolean> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupId'] && this.groupId) {
      this.ShowAllExam();
    }
  }

  ShowAllExam() {
    this.examService.getAllTeacherExam().subscribe({
      next: (res) => {
        this.examList = res;
        this.assignedExams = {};
        this.examList.forEach((exam) => this.IsAssigned(exam.id));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  AssignExam(examId: string) {
    const data: AssignExam = {
      examId: examId,
      groupId: this.groupId,
    };
    this.groupService.AssignExam(data).subscribe({
      next: (res) => {
        console.log(res);
        this.assignedExams[examId] = true;
        this.updateExamGroupsCount(examId, 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  UnAssignExam(examId: string) {
    this.groupService.UnAssignExam(examId, this.groupId).subscribe({
      next: (res) => {
        console.log(res);
        this.assignedExams[examId] = false;
        this.updateExamGroupsCount(examId, -1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  IsAssigned(examId: string) {
    this.groupService.IsExamAssigned(examId, this.groupId).subscribe({
      next: (res) => {
        this.isAssigned = res;
        this.assignedExams[examId] = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  isExamAssigned(examId: string): boolean {
    return !!this.assignedExams[examId];
  }

  trackByExamId(index: number, exam: Exams): string {
    return exam.id || index.toString();
  }

  private updateExamGroupsCount(examId: string, delta: number): void {
    const exam = this.examList.find((item) => item.id === examId);
    if (!exam) {
      return;
    }

    exam.groupsCount = Math.max(0, exam.groupsCount + delta);
  }
}
