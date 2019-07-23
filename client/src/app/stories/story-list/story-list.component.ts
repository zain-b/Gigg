import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {GiggUtils} from "../../helpers/gigg.utils";
import {MessagesService} from "../../services/messages.service";

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
              private messagesService: MessagesService) {
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
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }

  trimText(text: String, length: number) {
    return text.substring(0, length).trim();
  }

}
