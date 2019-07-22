import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {

  private serviceName = "[Connectivity Service] :: ";

  connectivitySubject$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

  constructor() { }

  connected(): Observable<Boolean> {
    return this.connectivitySubject$.asObservable();
  }

  init() {
    console.log(this.serviceName + "Initialising");

    /*
     * Set the initial value of connectivity. This handles the case where the page is physically refreshed whilst
     * the client is offline. The event listener will fire too early for our listener to receive and the connectivity
     * status will not be updated.
     *
     * This component will also be re-initialised, wiping out the previous connectivity status, causing a default init
     * value of true (online). To get around this, we manually check for connectivity on initialisation and push the
     * value to all subscribed components.
     */
    if(window.navigator.onLine) {
      this.connectivitySubject$.next(true);
    } else {
      this.connectivitySubject$.next(false);
    }

    window.addEventListener('online',  (event) => {
      console.log(this.serviceName + "Updating connectivity status: online");
      this.connectivitySubject$.next(true);
    });

    window.addEventListener('offline', (event) => {
      console.log(this.serviceName + "Updating connectivity status: offline");
      this.connectivitySubject$.next(false);
    });
  }
}
