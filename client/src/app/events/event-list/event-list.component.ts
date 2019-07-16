import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EventsService} from "../events.service";
import {Event} from "../../models/event.model";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnChanges {

  @Input()
  eventsToShow: number;

  @Input()
  events: Event[];

  groupSize = 3;
  groups = [[new Event()]];

  initialised = false;

  constructor(private eventsService: EventsService,
              private messagesService: FlashMessagesService) {
  }

  ngOnInit() {
    if(this.events) {
      this.prepareEventGroups();
      this.initialised = true;
      return;
    }

    this.eventsService.getEvents()
      .subscribe(
        (data: Event[]) => {
          this.events = data;
          this.prepareEventGroups();
          this.initialised = true;
        },
        error => {
          this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.initialised) {
      this.events = <Event[]> changes.events.currentValue;
      this.prepareEventGroups();
    }
  }

  // Split events into groups of 3 for presentation purposes, take into account whether max events to
  // show is provided.
  prepareEventGroups() {
    this.groups = [[new Event()]];

    if (this.events.length <= this.groupSize) {
      this.groups[0] = this.events;
      return;
    }

    let numGroups = (this.events.length % this.groupSize) + 1;

    for (let i = 0; i < numGroups; i++) {
      let currentGroupStart = i * this.groupSize;
      let currentGroupEnd = currentGroupStart + this.groupSize;

      if (this.eventsToShow && currentGroupEnd > this.eventsToShow) {
        this.groups[i] = this.events.slice(currentGroupStart, this.eventsToShow);
      } else {
        this.groups[i] = this.events.slice(currentGroupStart, currentGroupEnd);
      }
    }
  }

  trimText(text: String, length: number) {
    return text.substring(0, length).trim();
  }
}
