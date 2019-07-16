import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../models/story.model";
import {StoriesService} from "../../stories/stories.service";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

    @Input()
    storiesToShow: number;

    stories: Story[];

    constructor(private storiesService: StoriesService,
                private messagesService: FlashMessagesService) {
    }

    ngOnInit() {
        this.storiesService.getStories()
            .subscribe(
                (data: Story[]) => {
                    this.stories = data;
                },
                error => {
                    this.messagesService.show(error.error.message, {cssClass: 'flash-fade flash-error', timeout: 1000});
                });
    }

    trimText(text: String, length: number) {
        return text.substring(0, length).trim();
    }

}
