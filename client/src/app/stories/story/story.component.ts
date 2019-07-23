import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {ActivatedRoute} from "@angular/router";
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  @Input()
  story: Story;

  constructor(private storiesService: StoriesService,
              private route: ActivatedRoute,
              private messagesService: MessagesService) {
  }

  ngOnInit() {
    if (this.story) {
      return
    }

    let id = this.route.snapshot.params['id'];
    this.storiesService.getStory(id).then(
        story => {
          this.story = story;
        },
        error => {
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }
}
