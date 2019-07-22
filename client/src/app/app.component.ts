import {Component} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Observable} from "rxjs";
import {User} from "./models/user.model";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {fadeAnimation} from "./animations";
import {SocketService} from "./services/socket.service";
import {DataService} from "./services/data.service";
import {ConnectivityService} from "./services/connectivity.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation]
})
export class AppComponent {

  user$: Observable<User>;
  connected$: Observable<Boolean>;
  syncing$: Observable<Boolean>;
  connections$: Observable<Number>;

  constructor(private authenticationService: AuthenticationService,
              private flashMessageService: FlashMessagesService,
              private router: Router,
              private connectivityService: ConnectivityService,
              private socketService: SocketService,
              private dataService: DataService) {
    this.user$ = authenticationService.getUser();
    this.connectivityService.init();
    this.socketService.init();
    this.dataService.init();

    this.connected$ = this.connectivityService.connected();
    this.syncing$ = this.socketService.getSyncStatus();
    this.connections$ = this.socketService.getConnections();
  }

  logout() {
    this.authenticationService.logout();
  }
}
