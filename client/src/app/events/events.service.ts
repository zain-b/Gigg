import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Event} from '../models/event.model';
import {DataService} from "../services/data.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient,
              private dataService: DataService) {
  }

  getEvent(id: string) {
    return this.dataService.getEvent(id);

  }

  getEvents(): Observable<Event[]> {
    return this.dataService.getEvents();
  }

  createEvent(event: FormData) {
    return this.http.post('api/events/create', event);
  }
}
