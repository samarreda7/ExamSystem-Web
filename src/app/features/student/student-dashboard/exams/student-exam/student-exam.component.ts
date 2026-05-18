import { SubmitExam } from './../../../../../core/models/submit-exam.interface';
import { ExamService } from './../../../../../core/auth/services/exam.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamQuestion } from '../../../../../core/models/exam-question.interface';
import Swal from 'sweetalert2';
import { ExamResult } from '../../../../../core/models/exam-result.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-student-exam',
  imports: [DecimalPipe],
  templateUrl: './student-exam.component.html',
  styleUrl: './student-exam.component.css',
})
export class StudentExamComponent implements OnInit {
  private readonly examService = inject(ExamService);
  private readonly router = inject(Router);
  examQuestions: ExamQuestion[] = [];
  isLoading = false;
  isCheckingSubmission = false;
  constructor(private route: ActivatedRoute) {}
  submitBody: SubmitExam = {
    examId: '',
    answers: [],
  };
  isSubmited: boolean = false;
  examResult: ExamResult = {} as ExamResult;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.IsExamSubmited(id);
  }

  get totalOptions(): number {
    return this.examQuestions.reduce((total, question) => total + question.options.length, 0);
  }

  GetExamDetails(id: string) {
    this.isLoading = true;
    this.examService.GetExam(id).subscribe({
      next: (res) => {
        this.examQuestions = res;
        this.submitBody.examId = id;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  selectAnswer(questionId: string, optionId: string) {
    const existing = this.submitBody.answers.find((a) => a.questionId === questionId);
    if (existing) {
      existing.optionId = optionId;
    } else {
      this.submitBody.answers.push({ questionId, optionId });
    }
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    return this.submitBody.answers.some(
      (answer) => answer.questionId === questionId && answer.optionId === optionId,
    );
  }

  submitExam() {
    this.examService.SubmitExam(this.submitBody).subscribe({
      next: () => {
        void Swal.fire({
          title: 'Submited',
          text: 'Your answers hve been submited successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
          background: '#1e293b',
          color: '#f8fafc',
        });
        void this.router.navigate(['/student/exams']);
      },
      error: () => {},
    });
  }
  confirmSubmitExam(): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: 'This will Submit your exam.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#f8fafc',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitExam();
      }
    });
  }
  IsExamSubmited(examid: string) {
    this.isCheckingSubmission = true;
    this.isLoading = true;
    this.examService.IsExamSubmited(examid).subscribe({
      next: (res) => {
        this.isSubmited = res;
        this.isCheckingSubmission = false;

        if (this.isSubmited) {
          this.getExamResult(examid);
        } else {
          this.GetExamDetails(examid);
        }
      },
      error: () => {
        this.isCheckingSubmission = false;
        this.isLoading = false;
      },
    });
  }

  getExamResult(examid: string) {
    this.isLoading = true;
    this.examService.getExamResult(examid).subscribe({
      next: (res) => {
        this.examResult = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
