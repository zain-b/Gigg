import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If there is an active user with a JSON Web Token, automatically add it to headers
    let activeUser = this.authenticationService.getUserData();

    if (activeUser && activeUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: activeUser.token
        }
      });
    }

    return next.handle(request);
  }
}
