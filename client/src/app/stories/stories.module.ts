import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoriesRoutingModule} from './stories-routing.module';
import {SharedModule} from "../shared/shared.module";
import {StoryEventComponent} from './story-event/story-event.component';
import { StoryListComponent } from './story-list/story-list.component';
import { StoryComponent } from './story/story.component';

@NgModule({
    declarations: [StoryEventComponent, StoryListComponent, StoryComponent],
    exports: [
        StoryEventComponent,
        StoryListComponent,
        StoryComponent
    ],
    imports: [
        CommonModule,
        StoriesRoutingModule,
        SharedModule
    ]
})
export class StoriesModule {
}
