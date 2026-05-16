import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import Swal from 'sweetalert2';
import { UserInfo } from '../../../core/models/user-info.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  userRole: string = localStorage.getItem('Examrole') ?? '';
  userInfo: UserInfo | null = null;

  isMenuOpen = false;

  ngOnInit(): void {
    this.getUserInfo();
  }

  get fullName(): string {
    const profile = this.userInfo;
    if (!profile) {
      return 'Welcome back';
    }

    return `${profile.firstName} ${profile.lastName}`;
  }

  get avatarPath(): string {
    return this.userRole === 'Teacher' ? '/Images/TeacherProfile.jpg' : '/Images/StudentProfile.jpg';
  }

  get roleLabel(): string {
    return this.userInfo?.role || this.userRole || 'User';
  }

  get baseRoute(): string {
    return this.userRole === 'Teacher' ? '/teacher' : '/student';
  }

  getUserInfo() {
    this.authService.getMeInfo().subscribe({
      next: (res: UserInfo) => {
        this.userInfo = res;
        this.authService.setCurrentUser(res);
      },
      error: () => {},
    });
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  keepMenuOpen(event: MouseEvent): void {
    event.stopPropagation();
  }

  openUpdateProfile(): void {
    this.isMenuOpen = false;
    void this.router.navigate(['/update-user']);
  }

  logout() {
    this.isMenuOpen = false;
    this.authService.clearCurrentUser();
    localStorage.removeItem('Examtoken');
    localStorage.removeItem('Examrole');
    localStorage.removeItem('ExamuserId');
    this.router.navigate(['/login']);
  }

  confirmDeleteAccount(): void {
    this.isMenuOpen = false;

    void Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your account.',
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
        this.DeleteMyOwnAccount();
      }
    });
  }

  DeleteMyOwnAccount() {
    this.authService.DeleteMyAccount().subscribe({
      next: () => {
        void Swal.fire({
          title: 'Account deleted',
          text: 'Your account has been removed successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
          background: '#1e293b',
          color: '#f8fafc',
        });
        this.logout();
      },
      error: () => {
        void Swal.fire({
          title: 'Something went wrong',
          text: 'We could not delete your account. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
          background: '#1e293b',
          color: '#f8fafc',
        });
      },
    });
  }
}
