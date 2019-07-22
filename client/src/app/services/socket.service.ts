import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Event} from "../models/event.model";
import {Story} from "../models/story.model";
import {Properties} from "../config/properties";
import * as io from 'socket.io-client';
import {ConnectivityService} from "./connectivity.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private serviceName = "[Socket Service] :: ";
  private syncing$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private connections$: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

  socket;

  constructor(private dataService: DataService,
              private connectivityService: ConnectivityService){}

  init() {
    console.log(this.serviceName + "Initialising socket.io");
    this.socket = io(Properties.SOCKET_IO_URL);

    this.socket.on('complete-data', async (data: {events: Event[], stories: Story[]}) => {
      this.syncing$.next(true);
      console.log(this.serviceName + "Received socket message [complete-data]");
      await this.dataService.processCompleteData(data);

      /* Add a short delay before setting sync status to false. Otherwise, locally it happens so fast we never see it
       * kick in. Remove in production!
       */
      this.setSyncFalseAfterADelay();
    });

    this.socket.on('new-event', async (data: Event) => {
      this.syncing$.next(true);
      console.log(this.serviceName + "Received socket message [new-event]");
      await this.dataService.processNewEvent(data);
      this.setSyncFalseAfterADelay();
    });

    this.socket.on('new-story', async (data: Story) => {
      this.syncing$.next(true);
      console.log(this.serviceName + "Received socket message [new-story]");
      await this.dataService.processNewStory(data);
      this.setSyncFalseAfterADelay();
    });

    this.socket.on('connections', connections => {
      this.connections$.next(connections);
    });

    /**
     * Add event listeners to listen for online/offline event to manually establish/disconnect a socket connection.
     * This is needed because of the behaviour of some browsers when 'offline' mode is selected in development tools.
     *
     * Most browsers will not simulate offline mode for web sockets so we disconnect and connect them manually.
     * @param event
     */
    this.connectivityService.connected().subscribe(online => {
      if (online) {
        console.log(this.serviceName + "Back online! Establishing socket connection.");
        this.socket.connect();
      } else {
        console.log(this.serviceName + "Offline! Disconnecting socket connection.");
        this.socket.disconnect();
      }
    });

  }

  getSyncStatus(): Observable<Boolean> {
    return this.syncing$.asObservable();
  }

  getConnections(): Observable<Number> {
    return this.connections$.asObservable();
  }

  setSyncFalseAfterADelay() {
    setTimeout(() => {
      this.syncing$.next(false);
    }, 300);
  }
}
