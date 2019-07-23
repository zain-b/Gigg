import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model'
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import {Observable} from "rxjs";
import {ConnectivityService} from "../services/connectivity.service";
import {MessagesService} from "../services/messages.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  loading = false;
  connected: Observable<Boolean>;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private connectivityService: ConnectivityService,
              private messagesService: MessagesService) {

    this.connected = this.connectivityService.connected()
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService.login(this.user.email, this.user.password)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.sendMessage({success: true, text: "Hello again, " + data.user.username + "!"});
          this.router.navigate(['/']);
        },
        error => {
          this.loading = false;
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }

}
