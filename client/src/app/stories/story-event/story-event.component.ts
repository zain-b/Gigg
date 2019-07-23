import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";
import {Story} from "../../models/story.model";
import {StoriesService} from "../stories.service";
import {first} from "rxjs/operators";
import {AuthenticationService} from "../../services/authentication.service";
import {Observable} from "rxjs";
import {User} from "../../models/user.model";
import {ConnectivityService} from "../../services/connectivity.service";
import {MessagesService} from "../../services/messages.service";

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

  connected$: Observable<Boolean>;
  user$: Observable<User>;

  constructor(private storyService: StoriesService,
              private messagesService: MessagesService,
              private connectivityService: ConnectivityService,
              private authenticationService: AuthenticationService) {

    this.connected$ = this.connectivityService.connected();
    this.user$ = this.authenticationService.getUser();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;

    if (!this.story.tldr || !this.story.text || !this.event._id) {
      this.messagesService.sendMessage({success: false, text: 'Oops, TLDR and text are required!'});
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.set("tldr", this.story.tldr);
    formData.set("text", this.story.text);
    formData.set("event", this.event._id);

    for (let i = 0; i < this.files.length; i++) {
      formData.append("photos", this.files[i], this.files[i]['name']);
    }

    this.storyService.createStory(formData)
      .pipe(first())
      .subscribe(
        (data: {story: Story}) => {
          this.loading = false;
          this.messagesService.sendMessage({success: true, text: 'Created story!'});
          this.event.stories.unshift(data.story);
          this.story = new Story();
        },
        error => {
          this.loading = false;
          this.messagesService.sendMessage({success: false, text: error.error.message});
        });
  }

  filesAdded(event: any) {
    this.files = <Array<File>>event.target.files;
  }
}
