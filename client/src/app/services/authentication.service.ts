import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user.model';
import {map} from "rxjs/operators";
import {MessagesService} from "./messages.service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  /**
   * We use BehaviourSubject instead of Observable here so that every subscriber will always get the initial or
   * the last value that the subject emits.
   *
   * See: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
   */
  private user$: BehaviorSubject<User>;

  constructor(private http: HttpClient,
              private router: Router,
              private messagesService: MessagesService) {
    this.user$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  }

  getUser() : Observable<User> {
    return this.user$.asObservable();
  }

  getUserData() : User {
    return this.user$.value;
  }

  register(formData: FormData) {
    return this.http.post<any>('api/users/register', formData);
  }

  login(email: string, password: string) {
    return this.http.post<any>('/api/users/login', { email, password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data.user && data.user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(data.user));
          this.user$.next(data.user);
        }

        return data;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.user$.next(null);
    this.messagesService.sendMessage({success: true, text: "Logged out, see you next time."});
    this.router.navigateByUrl('/');
  }
}
