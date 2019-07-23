import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { User } from "../models/user.model";
import { first } from "rxjs/operators";
import {ConnectivityService} from "../services/connectivity.service";
import {Observable} from "rxjs";
import {MessagesService} from "../services/messages.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  files: Array<File> = [];
  loading = false;
  connected: Observable<Boolean>;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private connectivityService: ConnectivityService,
              private messagesService: MessagesService) {

    this.connected = this.connectivityService.connected();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
      const formData = new FormData();
      formData.set("username", this.user.username);
      formData.set("email", this.user.email);
      formData.set("password", this.user.password);

      if (this.files.length > 0) {
          formData.append("photo", this.files[0], this.files[0]['name']);
      }

    this.authenticationService.register(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.sendMessage({success: true, text: "Registration successful, please log in!"});
          this.router.navigate(['/login']);
        },
        error => {
          this.loading = false;
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }

    filesAdded(event: any) {
        this.files = <Array<File>> event.target.files;
    }
}
