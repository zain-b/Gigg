import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";

import {Event} from "../../models/event.model";
import {EventsService} from "../events.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

import {latLng, tileLayer} from 'leaflet';
import * as L from 'leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {GiggUtils} from "../../helpers/gigg.utils";
import {ConnectivityService} from "../../services/connectivity.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  event: Event;
  files: Array<File> = [];
  map: L.Map;
  loading = false;

  connected$: Observable<Boolean>;
  user$: Observable<User>;

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng([54.749990970226925, -2.680664062])
  };

  constructor(private eventsService: EventsService,
              private router: Router,
              private messagesService: FlashMessagesService,
              private connectivityService: ConnectivityService,
              private authenticationService: AuthenticationService) {

    this.connected$ = this.connectivityService.connected();
    this.user$ = this.authenticationService.getUser();
  }

  ngOnInit() {
    this.event = new Event();
  }

  onSubmit() {
    this.loading = true;
    const formData = new FormData();
    formData.set("title", this.event.title);
    formData.set("date", this.event.date);
    formData.append("location[address]", this.event.location.address);
    formData.append("location[x]", this.event.location.x.toString());
    formData.append("location[y]", this.event.location.y.toString());
    formData.append("location[city]", this.event.location.city.toString());
    formData.append("location[country]", this.event.location.country.toString());

    if (this.files.length > 0) {
      formData.append("photo", this.files[0], this.files[0]['name']);
    }

    this.eventsService.createEvent(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.show("Created event", {cssClass: 'flash-success', timeout: 1000});
          this.router.navigate(['/events']);
        },
        error => {
          this.loading = false;
          this.messagesService.show(error.error.message, {
            cssClass: 'flash-fade flash-error',
            timeout: 1000
          });
        });
  }

  filesAdded(event: any) {
    this.files = <Array<File>>event.target.files;
  }

  onMapReady(map: L.Map) {
    this.map = map;
    let myIcon = GiggUtils.makeCustomIcon();

    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: true,                                   // optional: true|false  - default true
      showPopup: false,                                   // optional: true|false  - default false
      marker: {                                           // optional: L.Marker    - default L.Icon.Default
        icon: myIcon,
        draggable: false,
      },
      popupFormat: ({query, result}) => result.label,   // optional: function    - default returns result label
      maxMarkers: 1,                                      // optional: number      - default 1
      retainZoomLevel: false,                             // optional: true|false  - default false
      animateZoom: true,                                  // optional: true|false  - default true
      autoClose: true,                                   // optional: true|false  - default false
      searchLabel: 'Enter location',                       // optional: string      - default 'Enter address'
      keepResult: true                                   // optional: true|false  - default false
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', this.updateChosenLocation);
  }

   updateChosenLocation = (result: any) => {
    console.log(JSON.stringify(result.location));
     this.event.location.address = result.location.label;
     this.event.location.x = result.location.x;
     this.event.location.y = result.location.y;
     this.event.location.city = result.location.raw.address.city;
     this.event.location.country = result.location.raw.address.country;
     console.log(this.event.location.address);
     console.log(this.event.location.x);
     console.log(this.event.location.y);
     console.log(this.event.location.city);
     console.log(this.event.location.country);
   }
}
