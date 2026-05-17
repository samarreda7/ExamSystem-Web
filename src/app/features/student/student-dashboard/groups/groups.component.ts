import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../../../core/auth/services/group.service';
import { StudentGroup } from '../../../../core/models/student-group.interface';

@Component({
  selector: 'app-student-groups',
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  GroupList: StudentGroup[] = [];
  isLoading = false;

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
}
