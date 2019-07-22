import { Injectable } from '@angular/core';
import {Event} from "../models/event.model";
import {Story} from "../models/story.model";
import {BehaviorSubject, Observable} from "rxjs";
import Dexie from 'dexie';

class GiggDatabase extends Dexie {
  events: Dexie.Table<Event,number>;

  constructor() {
    super("GiggDatabase");
    this.version(1).stores({
      events: "_id,title,date,photo,createdAt,location,creator,stories",
      stories: "_id,title,text,createdAt,photos,event,creator"
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

}
