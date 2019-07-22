import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../models/story.model";
import {DataService} from "../services/data.service";

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  constructor(private http: HttpClient,
              private dataService: DataService) {
  }

  getStory(id: string) {
    return this.dataService.getStory(id);

  }

  getStories(): Observable<Story[]> {
    return this.dataService.getStories();
  }

  createStory(story: FormData) {
    return this.http.post('api/stories/create', story);
  }
}
