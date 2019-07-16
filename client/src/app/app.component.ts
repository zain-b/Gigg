import {Component} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Observable} from "rxjs";
import {User} from "./models/user.model";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {fadeAnimation} from "./animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation]
})
export class AppComponent {

  user$: Observable<User>;

  constructor(private authenticationService: AuthenticationService,
              private flashMessageService: FlashMessagesService,
              private router: Router,) {
    this.user$ = authenticationService.getUser();
  }

  logout() {
    this.authenticationService.logout();
    this.flashMessageService.show("Logged out.", {cssClass: 'flash-success'});
  }


}
