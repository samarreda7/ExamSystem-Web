import { Component, inject, OnInit } from '@angular/core';
import { ExamService } from '../../../../core/auth/services/exam.service';
import { GroupService } from '../../../../core/auth/services/group.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserInfo } from '../../../../core/models/user-info.interface';

@Component({
  selector: 'app-student-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly examService = inject(ExamService);
  private readonly groupService = inject(GroupService);
  private readonly authService = inject(AuthService);

  userInfo: UserInfo | null = null;
  examCount: number = 0;
  groupCount: number = 0;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.GetGroupStudentCount();
    this.GetStudentExamCount();
  }

  get studentFirstName(): string {
    return this.userInfo?.firstName || 'Student';
  }

  loadCurrentUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userInfo = currentUser;
      return;
    }

    this.authService.getMeInfo().subscribe({
      next: (res) => {
        this.userInfo = res;
        this.authService.setCurrentUser(res);
      },
      error: () => {},
    });
  }

  GetStudentExamCount() {
    this.examService.GetStudentExamCount().subscribe({
      next: (res) => {
        this.examCount = res;
      },
      error: () => {},
    });
  }

  GetGroupStudentCount() {
    this.groupService.GetStudentGroupCount().subscribe({
      next: (res) => {
        this.groupCount = res;
      },
      error: () => {},
    });
  }
}
