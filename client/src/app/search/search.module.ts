import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchPageComponent} from './search-page/search-page.component';
import {SharedModule} from "../shared/shared.module";
import {StoriesModule} from "../stories/stories.module";
import {EventsModule} from "../events/events.module";

@NgModule({
  declarations: [SearchPageComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    StoriesModule,
    EventsModule
  ]
})
export class SearchModule {
}
