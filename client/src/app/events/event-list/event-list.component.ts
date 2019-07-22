import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EventsService} from "../events.service";
import {Event} from "../../models/event.model";
import {FlashMessagesService} from "angular2-flash-messages";
import {GiggUtils} from "../../helpers/gigg.utils";

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
      this.groups = GiggUtils.splitObjectsIntoGroupsOfX(this.events, this.groupSize, this.eventsToShow);
      this.initialised = true;
      return;
    }

    this.eventsService.getEvents()
      .subscribe(
        (data: Event[]) => {
          this.events = data;
          this.groups = GiggUtils.splitObjectsIntoGroupsOfX(this.events, this.groupSize, this.eventsToShow);
          this.initialised = true;
        },
        error => {
          this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.initialised) {
      this.events = <Event[]> changes.events.currentValue;
      this.groups = GiggUtils.splitObjectsIntoGroupsOfX(this.events, this.groupSize, this.eventsToShow);
    }
  }


}
