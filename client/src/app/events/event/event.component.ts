import {Component, OnInit} from '@angular/core';
import {Event} from '../../models/event.model'
import {EventsService} from "../events.service";
import {ActivatedRoute} from "@angular/router";
import {first} from "rxjs/operators";
import {FlashMessagesService} from "angular2-flash-messages";
import {latLng, tileLayer} from "leaflet";
import * as L from 'leaflet';
import {MyleafletUtils} from "../../helpers/myleaflet.utils";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {

  private event = new Event();
  private map: L.Map;

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng([54.749990970226925, -2.680664062]),
  };

  constructor(private eventsService: EventsService,
              private route: ActivatedRoute,
              private messagesService: FlashMessagesService) {
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.eventsService.getEvent(id)
      .pipe(first())
      .subscribe(
        event => {
          this.event = event;
          this.prepareMap();
        },
        error => {
          this.messagesService.show(error.error.message, {
            cssClass: 'flash-fade flash-error',
            timeout: 1000
          });
        });
  }

  prepareMap() {
    var locationMarker = MyleafletUtils.makeCustomMarker(this.event.location.x, this.event.location.y).addTo(this.map);
    locationMarker.bindPopup(MyleafletUtils.makeEventPopupHtml(locationMarker, this.event)).openPopup();
    this.map.setView(locationMarker.getLatLng(), 12);
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }
}
