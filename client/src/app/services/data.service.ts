import { Injectable } from '@angular/core';
import {Event} from "../models/event.model";
import {Story} from "../models/story.model";
import {BehaviorSubject, Observable} from "rxjs";
import Dexie from 'dexie';
import {Search} from "../models/search.model";

class GiggDatabase extends Dexie {
  events: Dexie.Table<Event,number>;

  constructor() {
    super("GiggDatabase");
    this.version(1).stores({
      events: "_id,title,date,location.address,location.x,location.y,photo,createdAt,creator,stories,*searchIndex",
      stories: "_id,tldr,text,createdAt,photos,event,creator"
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private serviceName = "[Data Service] :: ";

  private events$: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  private stories$: BehaviorSubject<Story[]> = new BehaviorSubject<Story[]>([]);

  db;

  constructor() { }

  init() {
    console.log(this.serviceName + "Initialising Gigg Database");
    this.db = new GiggDatabase();
    this.indexEventTitleAndLocation();
  }

  getEvent(id: string) {
    console.log(this.serviceName + "Processing request to retrieve event " + id);
    return this.db.events.where('_id').equals(id).first();
  }

  getEvents(): Observable<Event[]> {
    console.log(this.serviceName + "Processing request to retrieve all events");

    /*
     * If the page is manually refreshed, this service will be re-initialised which wipes the value of the events$
     * behaviour subject. This means all subscribed angular components lose data.
     *
     * To make sure the subscribed components receive the data from indexedDB in this case, we check if the events
     * behaviour subject is empty, in which case we push data from indexedDB into it. We don't need to wait for the
     * promise of pushing events to the behaviour subject because the component is already subscribed and will
     * automatically update with changes whenever they arrive.
     */
    if (!this.events$.value.length) {
      this.updateEvents();
    }

    return this.events$.asObservable();
  }

  getStory(id: string) {
    console.log(this.serviceName + "Processing request to retrieve story " + id);
    return this.db.stories.where('_id').equals(id).first();
  }

  getStories(): Observable<Story[]> {
    console.log(this.serviceName + "Processing request to retrieve all stories");

    /*
     * If the page is manually refreshed, this service will be re-initialised which wipes the value of the stories$
     * behaviour subject. This means all subscribed angular components lose data.
     *
     * To make sure the subscribed components receive the data from indexedDB in this case, we check if the stories
     * behaviour subject is empty, in which case we push data from indexedDB into it. We don't need to wait for the
     * promise of pushing stories to the behaviour subject because the component is already subscribed and will
     * automatically update with changes whenever they arrive.
     */
    if (!this.stories$.value.length) {
      this.updateStories()
    }

    return this.stories$.asObservable();
  }

  async processCompleteData(data: {events: Event[], stories: Story[]}) {
    console.log(this.serviceName + "Received request to store a new complete data set (events and stories) in DB");
    console.log(this.serviceName + "Clearing existing events and stories");

    await this.db.events.clear();
    await this.db.stories.clear();

    console.log(this.serviceName + "Adding new events to DB");
    await data.events.forEach(event => {
      this.db.events.add(event);
    });

    console.log(this.serviceName + "Adding new stories to DB");
    await data.stories.forEach(story => {
      this.db.stories.add(story);
    });

    this.updateEvents();
    this.updateStories();
  }

  async processNewEvent(event: Event) {
    console.log(this.serviceName + "Adding new event to IndexedDB.");
    await this.db.events.add(event);
    this.updateEvents();
  }

  async processNewStory(story: Story) {
    console.log(this.serviceName + "Adding new story to IndexedDB.");
    console.log("Story1 is " + JSON.stringify(story));
    await this.db.stories.put(story);

    console.log(this.serviceName + "Adding new story to existing event in IndexedDB.");
    console.log("Story2 is " + JSON.stringify(story));
    await this.db.events
      .where('_id')
      .equals(story.event._id)
      .modify(event => event.stories.push(story));

    this.updateEvents();
    this.updateStories();
  }

  async updateEvents() {
    console.log(this.serviceName + "Pushing all events from IndexedDB to Angular BehaviourSubject.");
    const events = await this.db.events.toArray();
    await this.events$.next(events.reverse());
  }

  async updateStories() {
    console.log(this.serviceName + "Pushing all stories from IndexedDB to Angular BehaviourSubject.");
    const stories = await this.db.stories.toArray();
    this.stories$.next(stories.reverse());
  }

  /**
   * Generic search function with multiple fields. If title or location is searched by we search the
   * 'searchIndex' we created on each record of the events table. If the date is also provided, we filter
   * these results.
   *
   * If neither title or location is provided, we filter all records in the events table by the date.
   * @param searchData
   */
  async searchEvents(searchData: Search): Promise<Event[]> {
    let results;

    if (searchData.text || searchData.location) {
      let text = searchData.text ? searchData.text.split(' ') : [];
      let location = searchData.location ? searchData.location.split(' ') : [];
      let words = text.concat(location);
      results = this.db.events.where('searchIndex').startsWithAnyOfIgnoreCase(words);
    } else {
      results = this.db.events;
    }
    
    if (!searchData.date) {
      return results.toArray();
    }

    // Filter results by date if provided. If no text or location search, then filter all events by date range.
    var providedDate = new Date(searchData.date);

    let dateBottom = new Date();
    let dateTop = new Date();

    dateBottom.setDate(providedDate.getDate() - 5);
    dateTop.setDate(providedDate.getDate() + 5);

    return results.filter(function (event) {
      let eventDate = new Date(event.date);
      return eventDate >= dateBottom && eventDate <= dateTop;
    }).toArray();
  }

  indexEventTitleAndLocation() {
    // Add hooks that will index event title and location together for full-text search:
    this.db.events.hook("creating", (primKey, event, trans) => {
      let titleLocationCity = (event.title + " " + event.location.address + " " + event.location.city).toLowerCase();
      let cleanText = this.removePunctuation(titleLocationCity);
      event.searchIndex = this.getUniqueWordsAsArray(cleanText);
    });
  }

  getUniqueWordsAsArray(text) {
    var words = text.split(' ');
    var uniqueWords = words.reduce(function (prev, current) {
      prev[current] = true;
      return prev;
    }, {});
    return Object.keys(uniqueWords);
  }

  /**
   * Removes punctuation and turns multiple spaces into one.
   * @param str
   */
  removePunctuation(str) {
    return str.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
  }
}
