import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model'
import { AuthenticationService } from "../services/authentication.service";
import { FlashMessagesService } from 'angular2-flash-messages';

import { first } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  loading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private messagesService: FlashMessagesService) {}

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService.login(this.user.email, this.user.password)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.show("Login successful!", { cssClass: 'flash-success', timeout: 1000 });
          this.router.navigate(['/']);
        },
        error => {
          this.loading = false;
          this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
        });
  }

}
