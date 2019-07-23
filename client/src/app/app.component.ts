import {Component} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Observable} from "rxjs";
import {User} from "./models/user.model";
import {Router} from "@angular/router";
import {fadeAnimation} from "./animations";
import {SocketService} from "./services/socket.service";
import {DataService} from "./services/data.service";
import {ConnectivityService} from "./services/connectivity.service";
import {MessagesService} from "./services/messages.service";
import {Message} from "./models/message.model";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation,   trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity:0}),
      animate(500, style({opacity:1}))
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate(500, style({opacity:0}))
    ])
  ])]
})
export class AppComponent {

  messages$: Observable<Message>;
  user$: Observable<User>;
  connected$: Observable<Boolean>;
  syncing$: Observable<Boolean>;
  connections$: Observable<Number>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private messagesService: MessagesService,
              private connectivityService: ConnectivityService,
              private socketService: SocketService,
              private dataService: DataService) {
    this.user$ = authenticationService.getUser();
    this.connectivityService.init();
    this.socketService.init();
    this.dataService.init();

    this.messages$ = this.messagesService.getMessage();
    this.connected$ = this.connectivityService.connected();
    this.syncing$ = this.socketService.getSyncStatus();
    this.connections$ = this.socketService.getConnections();
  }

  logout() {
    this.authenticationService.logout();
  }
}
