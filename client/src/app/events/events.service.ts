import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Event} from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(private http: HttpClient) {
    }

    getEvent(id: string): Observable<Event> {
        return this.http.get<Event>(`api/events/${id}`);

    }

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>('api/events');

    }

    createEvent(event: FormData) {
        return this.http.post('api/events/create', event);
    }
}
