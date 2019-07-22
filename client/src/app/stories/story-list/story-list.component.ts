import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {GiggUtils} from "../../helpers/gigg.utils";

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

  @Input()
  storiesToShow: number;

  stories: Story[];

  groupSize = 3;
  groups = [[new Story()]];

  initialised = false;

  constructor(private storiesService: StoriesService,
              private messagesService: FlashMessagesService) {
  }

  ngOnInit() {
    this.storiesService.getStories()
      .subscribe(
        (data: Story[]) => {
          this.stories = data;
          this.groups = GiggUtils.splitObjectsIntoGroupsOfX(this.stories, this.groupSize, this.storiesToShow);
          this.initialised = true;
        },
        error => {
          this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
        });
  }

  trimText(text: String, length: number) {
    return text.substring(0, length).trim();
  }

}
