import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-story-event',
  templateUrl: './story-event.component.html',
  styleUrls: ['./story-event.component.css']
})
export class StoryEventComponent implements OnInit {

  @Input()
  event: Event;

  story = new Story();
  files: Array<File> = [];
  loading = false;

  constructor(private storyService: StoriesService,
              private messagesService: FlashMessagesService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    const formData = new FormData();
    formData.set("title", this.story.title);
    formData.set("text", this.story.text);
    formData.set("event", this.event._id);

    for (let i = 0; i < this.files.length; i++) {
      formData.append("photos", this.files[i], this.files[i]['name']);
    }

    this.storyService.createStory(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.messagesService.show("Created story!", {cssClass: 'flash-success', timeout: 1000});
          this.story = new Story();
        },
        error => {
          this.loading = false;
          this.messagesService.show(error.error.message, {
            cssClass: 'flash-fade flash-error',
            timeout: 1000
          });
        });
  }

  filesAdded(event: any) {
    this.files = <Array<File>>event.target.files;
  }
}
