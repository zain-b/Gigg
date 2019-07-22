import { Component, OnInit } from '@angular/core';
import {EventsService} from "../events.service";
import {Event} from "../../models/event.model";

@Component({
  selector: 'app-events-all',
  templateUrl: './event-all.component.html',
  styleUrls: ['./event-all.component.css']
})
export class EventAllComponent implements OnInit {

  numEvents: number;

  constructor(private eventsService: EventsService) {
    this.eventsService.getEvents().subscribe((events: Event[]) => {
      this.numEvents = events.length;
    })
  }

  ngOnInit() {
  }

}
