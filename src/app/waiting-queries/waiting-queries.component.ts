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
  private colors = [
    'rgb(0 185 255)',
    'rgb(0 145 255)',
    'rgb(0 105 255)',
    'rgb(0 65 255)'
  ]

  constructor(public frontierNodes: FrontierNodesService,
    private configuration: ConfigurationService, 
    private router: Router) { }

  ngOnInit(): void {
    
  }

  private getDepth(task: ExpandTask): number {
    return task.name.split('.').length
  }

  public getBackgroundColor(task: ExpandTask): string {
    let depth = this.getDepth(task) - 2
    if (depth < this.colors.length) {
      return this.colors[depth]
    } else {
      return this.colors[this.colors.length - 1]
    }
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

  public explainRewriting(task: ExpandTask): void {
    if (this.openTask != null && this.openTask.name == task.name) {
      this.router.navigate(['/'])
      this.openTask = null
    } else {
      this.router.navigate(['/tasks', task.name])
      this.openTask = task
    }    
  }
}
