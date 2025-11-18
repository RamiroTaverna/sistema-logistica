import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'logistics-user';
  private currentUser$ = new BehaviorSubject<User | null>(this.loadUser());

  get userChanges(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  login(username: string, password: string): Observable<User> {
    // Simulación de autenticación local
    const user: User = {
      username,
      role: username === 'admin' ? 'admin' : 'operador',
      token: btoa(`${username}:${password}:${Date.now()}`),
    };
    return of(user).pipe(tap((u) => this.persist(u)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser$.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser$.value;
  }

  private persist(user: User) {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private loadUser(): User | null {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? (JSON.parse(saved) as User) : null;
  }
}
