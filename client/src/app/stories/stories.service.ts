import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../models/story.model";

@Injectable({
    providedIn: 'root'
})
export class StoriesService {

    constructor(private http: HttpClient) {
    }

    getStory(id: string): Observable<Story> {
        return this.http.get<Story>(`api/stories/${id}`);

    }

    getStories(): Observable<Story[]> {
        return this.http.get<Story[]>('api/stories');

    }

    createStory(story: FormData) {
        return this.http.post('api/stories/create', story);
    }
}
