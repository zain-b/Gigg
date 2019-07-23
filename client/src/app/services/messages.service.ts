import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Message} from "../models/message.model";
import {init} from "protractor/built/launcher";

@Injectable({
  providedIn: 'root'
})
export class MessagesService implements  OnInit {

  message$ : BehaviorSubject<Message>;

  constructor() {
    let initMessage = new Message();
    initMessage.show = false;

    this.message$ = new BehaviorSubject<Message>(initMessage);
  }

  getMessage(): Observable<Message> {
    return this.message$.asObservable();
  }

  ngOnInit(): void {
    let initMessage = new Message();
    initMessage.show = false;
    this.message$.next(initMessage);
  }

  sendMessage(input: {success: boolean, text: string}) {
    let message = new Message();
    message.success = input.success;
    message.text = input.text;

    this.message$.next(message);

    let noMessage = new Message();
    noMessage.show = false;

    setTimeout(() => {
      this.message$.next(noMessage);
    }, 1500)
  }
}
