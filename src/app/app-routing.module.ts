import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component'
import { TaskDetailComponent } from './task-detail/task-detail.component';

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'tasks/:taskName', component: TaskDetailComponent }
  // { path: '**', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
