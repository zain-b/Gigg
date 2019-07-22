import {Component, OnInit} from '@angular/core';
import {StoriesService} from "../stories.service";
import {Story} from "../../models/story.model";

@Component({
  selector: 'app-stories-all',
  templateUrl: './story-all.component.html',
  styleUrls: ['./story-all.component.css']
})
export class StoryAllComponent implements OnInit {

  numStories: number;

  constructor(private storiesService: StoriesService) {
    this.storiesService.getStories().subscribe((stories: Story[]) => {
      this.numStories = stories.length;
    })
  }

  ngOnInit() {
  }

}
