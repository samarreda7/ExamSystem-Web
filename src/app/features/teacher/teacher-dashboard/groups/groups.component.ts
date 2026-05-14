import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/auth/services/group.service';
import { ShowGroup } from '../../../../core/models/show-group.interface';
import { StudentgroupComponent } from './studentgroup/studentgroup.component';
import { ExamgroupComponent } from "./examgroup/examgroup.component";

@Component({
  selector: 'app-teacher-groups',
  imports: [CommonModule, FormsModule, StudentgroupComponent, ExamgroupComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  @ViewChild('managerPanel') managerPanel?: ElementRef<HTMLElement>;
  groupList: ShowGroup[] = [];
  studentCounts: Record<string, number> = {};
  examCounts: Record<string, number> = {};
  userId: string = localStorage.getItem('ExamuserId') ?? '';
  groupName = '';
  selectedGroup: ShowGroup | null = null;
  activeSection: 'students' | 'exams' | '' = '';

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups() {
    this.groupService.GetAllGroups().subscribe({
      next: (res) => {
        this.groupList = res;
        this.groupList.forEach((group) => {
          this.StudentCount(group.id);
          this.ExamCount(group.id);
        });
      },
      error: () => {},
    });
  }
  StudentCount(groupId: string) {
    this.groupService.StudentCountOnGroup(groupId).subscribe({
      next: (res) => {
        this.studentCounts[groupId] = res;
      },
      error: () => {},
    });
  }
  ExamCount(groupId: string) {
    this.groupService.ExamCountOnGroup(groupId).subscribe({
      next: (res) => {
        this.examCounts[groupId] = res;
      },
      error: () => {},
    });
  }
  AddGroup(name: string) {
    const trimedName = name.trim();
    if (!trimedName) {
      return;
    }
    this.groupService.AddGroup(trimedName).subscribe({
      next: () => {
        this.groupName = '';
        this.getAllGroups();
      },
      error: () => {},
    });
  }

  openStudentManager(group: ShowGroup) {
    this.selectedGroup = group;
    this.activeSection = 'students';
    this.scrollToManagerPanel();
  }

  openExamManager(group: ShowGroup) {
    this.selectedGroup = group;
    this.activeSection = 'exams';
    this.scrollToManagerPanel();
  }

  closeManager() {
    this.selectedGroup = null;
    this.activeSection = '';
  }

  getStudentCount(groupId: string): number {
    return this.studentCounts[groupId] || 0;
  }

  getExamCount(groupId: string): number {
    return this.examCounts[groupId] || 0;
  }

  trackByGroupId(index: number, group: ShowGroup): string {
    return group.id || index.toString();
  }

  private scrollToManagerPanel() {
    setTimeout(() => {
      this.managerPanel?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }
}
