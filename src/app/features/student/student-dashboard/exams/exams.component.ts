import { Component, inject, OnInit } from '@angular/core';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { StudentExam } from '../../../../core/models/student-exam.interface';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-exams',
  imports: [],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  private readonly examService = inject(ExamService);
  private readonly router = inject(Router);
  ExamList: StudentExam[] = [];
  isLoading = false;
  submittedExamMap: Record<string, boolean> = {};

  ngOnInit(): void {
    this.GetStudentExam();
  }

  GetStudentExam() {
    this.isLoading = true;
    this.examService.GetStudentExam().subscribe({
      next: (res) => {
        this.ExamList = res;
        this.loadExamSubmissionStates(res);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get totalQuestions(): number {
    return this.ExamList.reduce((total, exam) => total + exam.questionsCount, 0);
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
    if (exams.length === 0) {
      this.submittedExamMap = {};
      return;
    }

    forkJoin(
      exams.map((exam) => this.examService.IsExamSubmited(exam.examId)),
    ).subscribe({
      next: (results) => {
        this.submittedExamMap = exams.reduce(
          (map, exam, index) => {
            map[exam.examId] = results[index];
            return map;
          },
          {} as Record<string, boolean>,
        );
      },
      error: () => {
        this.submittedExamMap = {};
      },
    });
  }
}
