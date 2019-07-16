import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Event} from '../models/event.model';
import {HttpParams} from '@angular/common/http'
import {Search} from "../models/search.model";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {
  }

  searchEvents(searchData: Search): Observable<Event[]> {
    let params = new HttpParams();

    for(let key in searchData){
      params = params.set(key, searchData[key])
    }

    return this.http.get<Event[]>(`api/search/events?${params.toString()}`);
  }
}
