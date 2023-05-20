// ??? import this in app.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventComponent } from './event/event.component';
import { LastEventsComponent } from './last-events/last-events.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {path:'event', component:EventComponent},
  {path:'lastEvents', component:LastEventsComponent},
  {path:'', component:HomepageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule {}
