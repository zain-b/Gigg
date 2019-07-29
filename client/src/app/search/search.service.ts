import {Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Event} from '../models/event.model';
import {HttpParams} from '@angular/common/http'
import {Search} from "../models/search.model";
import {DataService} from "../services/data.service";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  serviceName = '[Search Service] :: ';

  constructor(private http: HttpClient,
              private dataService: DataService) {
  }

  searchEvents(searchData: Search, online: boolean): Observable<Event[]> {
    let params = new HttpParams();

    for(let key in searchData){
      params = params.set(key, searchData[key])
    }

    if (online) {
      console.log(this.serviceName + "Searching " + params.toString() + " online.");
      return this.http.get<Event[]>(`api/search/events?${params.toString()}`);
    }

    // The data service returns a promise from IndexedDB, turn it into an observable using RxJS 'from' to stay
    // consistent with the type signature of this method.
    console.log(this.serviceName + "Searching offline [" + JSON.stringify(searchData) + "]");
    return from(this.dataService.searchEvents(searchData));
  }
}
