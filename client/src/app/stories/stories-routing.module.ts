import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StoryListComponent} from "./story-list/story-list.component";
import {StoryComponent} from "./story/story.component";

const routes: Routes = [
    {path: 'stories', component: StoryListComponent},
    {path: 'stories/:id', component: StoryComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoriesRoutingModule {

}
