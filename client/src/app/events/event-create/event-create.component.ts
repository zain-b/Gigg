import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";

import {Event} from "../../models/event.model";
import {EventsService} from "../events.service";
import {Router} from "@angular/router";

import {latLng, tileLayer} from 'leaflet';
import * as L from 'leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {GiggUtils} from "../../helpers/gigg.utils";
import {ConnectivityService} from "../../services/connectivity.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user.model";
import {MessagesService} from "../../services/messages.service";

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
              private messagesService: MessagesService,
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

    if (!this.event.title || !this.event.date || !this.event.location.address || !this.event.location.x ||
      !this.event.location.y || !this.event.location.country || !this.files.length) {

      this.messagesService.sendMessage({success:false, text: "All fields are required, " +
          "don't forget to select a location and an image"});

      this.loading = false;
      return;
    }

    if (!this.event.location.city) {
      this.messagesService.sendMessage({success: false, text: "Oops, the selected location has no city associated with it."});
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.set("title", this.event.title);
    formData.set("date", this.event.date);
    formData.append("location[address]", this.event.location.address);
    formData.append("location[x]", this.event.location.x.toString());
    formData.append("location[y]", this.event.location.y.toString());
    formData.append("location[country]", this.event.location.country.toString());
    formData.append("location[city]", this.event.location.city.toString());

    if (this.files.length > 0) {
      formData.append("photo", this.files[0], this.files[0]['name']);
    }

    this.eventsService.createEvent(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.sendMessage({success: true, text: 'Your Gigg event has been created!'});
          this.router.navigate(['/events']);
        },
        error => {
          this.loading = false;
          this.messagesService.sendMessage({success: false, text: error.error.message});
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
    this.event.location.address = result.location.label;
    this.event.location.x = result.location.x;
    this.event.location.y = result.location.y;
    this.event.location.city = result.location.raw.address.city;
    this.event.location.country = result.location.raw.address.country;
  }
}
