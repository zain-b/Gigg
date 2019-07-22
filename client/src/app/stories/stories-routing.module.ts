import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StoryComponent} from "./story/story.component";
import {StoryAllComponent} from "./story-all/story-all.component";

const routes: Routes = [
  {path: 'stories', component: StoryAllComponent},
  {path: 'stories/:id', component: StoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoriesRoutingModule {

}
