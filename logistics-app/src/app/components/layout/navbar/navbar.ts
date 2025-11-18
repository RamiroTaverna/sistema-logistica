import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  user$ = this.auth.userChanges;
  theme$ = new BehaviorSubject<string>(this.loadTheme());

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    const current = this.theme$.value === 'dark' ? 'light' : 'dark';
    this.applyTheme(current);
  }

  private loadTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('logistics-theme');
    return saved === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      this.document.documentElement.classList.add('theme-dark');
    } else {
      this.document.documentElement.classList.remove('theme-dark');
    }
    localStorage.setItem('logistics-theme', theme);
    this.theme$.next(theme);
  }

  constructor() {
    this.applyTheme(this.theme$.value as 'light' | 'dark');
  }
}
