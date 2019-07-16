import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {ActivatedRoute} from "@angular/router";
import {FlashMessagesService} from "angular2-flash-messages";
import {first} from "rxjs/operators";

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
                private messagesService: FlashMessagesService) { }

    ngOnInit() {
        if (this.story) {
            console.log("story so returning");
            return}

        let id = this.route.snapshot.params['id'];
        console.log("Getting story.")
        this.storiesService.getStory(id)
            .pipe(first())
            .subscribe(
                story => {
                    this.story = story;
                },
                error => {
                    this.messagesService.show(error.error.message, {
                        cssClass: 'flash-fade flash-error',
                        timeout: 1000
                    });
                });
    }
}
