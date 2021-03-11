import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpandTask } from '../models/ExpandTask';
import { ConfigurationService } from '../services/ConfigurationService';
import { FrontierNodesService } from '../services/FrontierNodesService';

@Component({
  selector: 'app-waiting-queries',
  templateUrl: './waiting-queries.component.html',
  styleUrls: ['./waiting-queries.component.sass']
})
export class WaitingQueriesComponent implements OnInit {

  private openTask: ExpandTask

  constructor(public frontierNodes: FrontierNodesService,
    private configuration: ConfigurationService, 
    private router: Router) { }

  ngOnInit(): void {
    
  }

  public getDepth(task: ExpandTask): number {
    return task.name.split('.').length
  }

  private currentDepth(): number {
    if (this.frontierNodes.queue.length == 0) {
      return 1
    } else {
      return this.getDepth(this.frontierNodes.queue[0])
    }
  }

  public minLengthExploredPath(): number {
    return (this.currentDepth() - 1) * this.configuration.maxDepth
  }

  public maxLengthExploredPath(): number {
    return this.currentDepth() * this.configuration.maxDepth
  }

  public showDetail(task: ExpandTask): void {
    if (this.openTask != null && this.openTask.name == task.name) {
      this.router.navigate(['/'])
      this.openTask = null
    } else {
      this.router.navigate(['/tasks', task.name])
      this.openTask = task
    }    
  }
}
