import {User} from './user.model';
import {Story} from './story.model';
import {Location} from './location.model';

export class Event {
  public _id: string;
  public title: string;
  public date: string;
  public photo: string;
  public createdAt: string;
  public location: Location;
  public creator: User;
  public stories: Story[];

  constructor() {
    this.location = new Location();
  }
}
