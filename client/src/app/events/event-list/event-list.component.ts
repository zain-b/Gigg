import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EventsService} from "../events.service";
import {Event} from "../../models/event.model";
import {GiggUtils} from "../../helpers/gigg.utils";
import {MessagesService} from "../../services/messages.service";

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
              private messagesService: MessagesService) {
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
          this.messagesService.sendMessage({success: false, text: error.error.message})
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.initialised) {
      this.events = <Event[]> changes.events.currentValue;
      this.groups = GiggUtils.splitObjectsIntoGroupsOfX(this.events, this.groupSize, this.eventsToShow);
    }
  }


}
