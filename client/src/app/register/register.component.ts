import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { User } from "../models/user.model";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  files: Array<File> = [];
  loading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private messagesService: FlashMessagesService) {}

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
          this.messagesService.show("Registration successful, please log in!", { cssClass: 'flash-success', timeout: 1000 });
          this.router.navigate(['/login']);
        },
        error => {
          this.loading = false;
          this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
        });
  }

    filesAdded(event: any) {
        this.files = <Array<File>> event.target.files;
    }
}
