import { Component } from '@angular/core';
import { ExpandTask } from './models/ExpandTask';
import { TaskManagerService } from './services/TaskManagerService';
import { FrontierNodesService } from './services/FrontierNodesService';
import { ServerEvalService } from './services/ServerEvalService';
import { VisitedNodesService } from './services/VisitedNodesService';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app-settings';
import { SpyService } from './services/SpyService';
import { SolutionMappingsService } from './services/SolutionMappingsService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  public quantum: number
  public maxDepth: number
  public query: string
  public graph: string

  public running: boolean

  constructor(
    private httpClient: HttpClient,
    private serverEval: ServerEvalService, 
    private taskManager: TaskManagerService,
    private visitedNodes: VisitedNodesService,
    public solutionMappings: SolutionMappingsService,
    public spy: SpyService,
    public frontierNodes: FrontierNodesService) { }

  ngOnInit(): void {
    this.quantum = 1500
    this.maxDepth = 5
    this.running = false
  }

  public stopQuery(): void {
    this.frontierNodes.clear()
    this.serverEval.stop()
    this.running = false
  }

  public executeQuery() {
    let url = `${AppSettings.SAGE_ENDPOINT}/backdoor/overwrite-config`
    let body = { quantum: this.quantum, maxDepth: this.maxDepth }
    this.spy.clear()
    this.visitedNodes.clear()
    this.frontierNodes.clear()
    this.solutionMappings.clear()
    this.running = true
    this.httpClient.post(url, body).subscribe(() => {
      let node: ExpandTask = this.taskManager.create(null, this.query, null)
      this.serverEval.execute(node, this.graph).then(() => {
        if (this.frontierNodes.queue.length == 0) {
          this.running = false
        }
      }).catch((error: any) => {
        console.error(error)
        this.running = false
      })
    })
  }

  public expandFrontierNode() {
    let next: ExpandTask = this.frontierNodes.queue.shift()
    if (this.visitedNodes.mustExpand(next.controlTuple)) {
      this.serverEval.execute(next, this.graph).then(() => {
        if (this.frontierNodes.queue.length == 0) {
          this.running = false
        }
      }).catch((error: any) => {
        console.error(error)
        this.running = false
      })
    }
  }
}
