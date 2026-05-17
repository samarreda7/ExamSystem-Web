import { Component, inject, OnInit } from '@angular/core';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { StudentExam } from '../../../../core/models/student-exam.interface';

@Component({
  selector: 'app-student-exams',
  imports: [],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  private readonly examService = inject(ExamService);
  ExamList: StudentExam[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.GetStudentExam();
  }

  GetStudentExam() {
    this.isLoading = true;
    this.examService.GetStudentExam().subscribe({
      next: (res) => {
        this.ExamList = res;
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
}
