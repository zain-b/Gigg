import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search.service";
import * as L from "leaflet";
import {tileLayer} from "leaflet";
import {latLng} from "leaflet";
import {EventsService} from "../../events/events.service";
import {Event} from "../../models/event.model";
import {GiggUtils} from "../../helpers/gigg.utils";
import {Search} from "../../models/search.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {MessagesService} from "../../services/messages.service";
import {ConnectivityService} from "../../services/connectivity.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ],
})
export class SearchPageComponent implements OnInit {

  searchData = new Search();
  lastSearch: Search;

  map: L.Map;
  events: Event[];
  mapMarkers = [];
  searched = false;
  loading = false;
  online = false;

  connected: Observable<Boolean>;

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      })
    ],
    zoom: 5,
    center: latLng([54.749990970226925, -1.780664062]),
  };

  constructor(private searchService: SearchService,
              private eventsService: EventsService,
              private connectivityService: ConnectivityService,
              private messagesService: MessagesService) {

    this.connected = this.connectivityService.connected();
  }

  ngOnInit() {
    this.connected.subscribe(online => {
      this.online = online.valueOf();
    });

    this.eventsService.getEvents()
      .subscribe(
        (data: Event[]) => {
          if (data.length) {
            this.events = data;
            this.addMarkersToMap(this.events);
          }
        },
        error => {
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }

  onSubmit() {
    this.searched = false;
    this.loading = true;

    this.searchService.searchEvents(this.searchData, this.online)
      .subscribe(
        (events: Event[]) => {
          this.lastSearch = this.searchData;
          this.searchData = new Search();
          this.events = events;
          this.addMarkersToMap(events);
          this.searched = true;
          this.messagesService.sendMessage({success: true, text: 'Search succeeded!'});
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.log(error);
          this.messagesService.sendMessage({success: false, text: 'An error occurred. Check logs.'});
        });
  }

  searchThisArea() {
    this.loading = true;
    let foundEvents = [];

    this.eventsService.getEvents()
      .subscribe(
        (events: Event[]) => {
          events.forEach(event => {
            let coords = latLng([event.location.y, event.location.x]);
            if(this.map.getBounds().contains(coords)) {
              foundEvents.push(event);
            }
          });

          this.events = foundEvents;
          this.addMarkersToMap(foundEvents);
          this.searched = true;
          this.messagesService.sendMessage({success: true, text: 'Area search succeeded!'});
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.error(error);
          this.messagesService.sendMessage({success: false, text: 'An error occurred check logs.'});
        });
  }

  clearMapAndSearch() {
    this.removeAllMarkers();
    this.events = [];
    this.searchData = new Search();
    this.searched = false;
    this.messagesService.sendMessage({success: true, text: 'All clear!'});
  }

  addMarkersToMap(events: Event[]) {

    /*
     * Since I can't find a callback for when the leaflet map is ready and initialised. I have concocted this ugly
     * (temporary) workaround. Wait till map is ready before trying to add markers to it. Check periodically if it's
     * ready.
     */
    if (!this.map) {
      setTimeout(() => {
        this.addMarkersToMap(events);
      }, 500);

      return;
    }

    this.removeAllMarkers();

    events.forEach(event => {
      var locationMarker = GiggUtils.makeCustomMarker(event.location.x, event.location.y);
      locationMarker.bindPopup(GiggUtils.makeEventPopupHtml(locationMarker, event)).openPopup();
      locationMarker.addTo(this.map);
      this.mapMarkers.push(locationMarker);
    });
  }

  removeAllMarkers() {
    this.mapMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });

    this.mapMarkers = [];
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }
}
