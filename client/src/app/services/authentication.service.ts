import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
// Interfaces here

@Injectable()
export class AuthenticationService {
  private activeUser: User;

  constructor(private http: HttpClient, private router: Router) {}

  private storeUser(user: User): void {
    localStorage.setItem('active-user', JSON.stringify(user));
    this.activeUser = user;
  }

  public getUser(): User {
    if (!this.activeUser) {
      this.activeUser = JSON.parse(localStorage.getItem('active-user'));
    }
    return this.activeUser;
  }

  public logout(): void {
    this.activeUser = null;
    window.localStorage.removeItem('active-user');
    this.router.navigateByUrl('/');
  }
}
