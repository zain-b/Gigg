import {User} from "./user.model";
import {Event} from "./event.model";

export class Story {
    public _id: number;
    public title: string;
    public text: string;
    public createdAt: string;
    public photos: string[];
    public event: Event;
    public creator: User;

    constructor() {}
}
