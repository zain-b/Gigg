import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {EventComponent} from "./event/event.component";
import {EventCreateComponent} from "./event-create/event-create.component";
import {EventAllComponent} from "./event-all/event-all.component";

const eventRoutes: Routes = [
  {path: 'events', component: EventAllComponent},
  {path: 'events/create', component: EventCreateComponent},
  {path: 'events/:id', component: EventComponent},
];

@NgModule({
  imports: [RouterModule.forChild(eventRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
