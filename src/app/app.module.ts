import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { WaitingQueriesComponent } from './waiting-queries/waiting-queries.component';
import { QueryResultsComponent } from './query-results/query-results.component';
import { LiveStatisticsComponent } from './live-statistics/live-statistics.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { QueryProgressComponent } from './query-progress/query-progress.component';
import { StatisticsComponent } from './statistics/statistics.component';

import { ServerEvalService } from './services/ServerEvalService';
import { SolutionMappingsService } from './services/SolutionMappingsService';
import { VisitedNodesService } from './services/VisitedNodesService';
import { FrontierNodesService } from './services/FrontierNodesService';
import { TaskManagerService } from './services/TaskManagerService';
import { SpyService } from './services/SpyService';
import { MonitoringService } from './services/MonitoringService';
import { PathPatternIdentifierService } from './services/PathPatternIdentifierService';

@NgModule({
  declarations: [
    AppComponent,
    QueryEditorComponent,
    WaitingQueriesComponent,
    QueryResultsComponent,
    LiveStatisticsComponent,
    TaskDetailComponent,
    QueryProgressComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    CodemirrorModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    ServerEvalService,
    SolutionMappingsService,
    VisitedNodesService,
    FrontierNodesService,
    TaskManagerService,
    SpyService,
    MonitoringService,
    PathPatternIdentifierService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
