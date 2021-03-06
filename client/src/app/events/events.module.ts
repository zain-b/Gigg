import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EventsRoutingModule} from './events-routing.module';
import {EventListComponent} from './event-list/event-list.component';
import {EventComponent} from "./event/event.component";
import {EventCreateComponent} from './event-create/event-create.component';
import {SharedModule} from "../shared/shared.module";
import {StoriesModule} from "../stories/stories.module";
import {EventAllComponent} from './event-all/event-all.component';


@NgModule({
  declarations: [
    EventListComponent,
    EventComponent,
    EventCreateComponent,
    EventAllComponent,
  ],
  exports: [
    EventListComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    StoriesModule,
  ]
})
export class EventsModule {
}
