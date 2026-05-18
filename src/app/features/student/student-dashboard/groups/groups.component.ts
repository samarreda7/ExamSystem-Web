import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../../../core/auth/services/group.service';
import { StudentGroup } from '../../../../core/models/student-group.interface';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { StudentExam } from '../../../../core/models/student-exam.interface';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-groups',
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly examService = inject(ExamService);
  private readonly router = inject(Router);
  GroupList: StudentGroup[] = [];
  isLoading = false;
  expandedGroupId: string | null = null;
  groupExams: Record<string, StudentExam[]> = {};
  loadingExamGroupId: string | null = null;
  submittedExamMap: Record<string, boolean> = {};

  ngOnInit(): void {
    this.GetStudentGroups();
  }

  GetStudentGroups() {
    this.isLoading = true;
    this.groupService.GetStudentGroup().subscribe({
      next: (res) => {
        this.GroupList = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get uniqueSubjectsCount(): number {
    return new Set(this.GroupList.map((group) => group.subjectName)).size;
  }

  trackByGroupId(index: number, group: StudentGroup): string {
    return group.id;
  }

  toggleGroupExams(groupId: string): void {
    if (this.expandedGroupId === groupId) {
      this.expandedGroupId = null;
      return;
    }

    this.expandedGroupId = groupId;

    if (this.groupExams[groupId]) {
      return;
    }

    this.GetGroupExam(groupId);
  }

  GetGroupExam(id: string) {
    this.loadingExamGroupId = id;
    this.examService.GetExamsByGroupId(id).subscribe({
      next: (res) => {
        this.groupExams[id] = res;
        this.loadExamSubmissionStates(res);
        this.loadingExamGroupId = null;
      },
      error: () => {
        this.groupExams[id] = [];
        this.loadingExamGroupId = null;
      },
    });
  }

  getGroupExams(groupId: string): StudentExam[] {
    return this.groupExams[groupId] || [];
  }

  isExamListOpen(groupId: string): boolean {
    return this.expandedGroupId === groupId;
  }

  trackByExamId(index: number, exam: StudentExam): string {
    return exam.examId;
  }

  openExam(exam: StudentExam): void {
    void this.router.navigate(['/student/exam', exam.examId]);
  }

  isExamSubmitted(examId: string): boolean {
    return this.submittedExamMap[examId] ?? false;
  }

  private loadExamSubmissionStates(exams: StudentExam[]): void {
    const examsToLoad = exams.filter((exam) => this.submittedExamMap[exam.examId] === undefined);

    if (examsToLoad.length === 0) {
      return;
    }

    forkJoin(
      examsToLoad.map((exam) => this.examService.IsExamSubmited(exam.examId)),
    ).subscribe({
      next: (results) => {
        const nextMap = { ...this.submittedExamMap };
        examsToLoad.forEach((exam, index) => {
          nextMap[exam.examId] = results[index];
        });
        this.submittedExamMap = nextMap;
      },
      error: () => {},
    });
  }
}
