import { Component } from '@angular/core';
import { ExpandTask } from './models/ExpandTask';
import { TaskManagerService } from './services/TaskManagerService';
import { FrontierNodesService } from './services/FrontierNodesService';
import { ServerEvalService } from './services/ServerEvalService';
import { VisitedNodesService } from './services/VisitedNodesService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  public query: string = ""
  public running: boolean = false

  constructor(
    private serverEval: ServerEvalService, 
    private taskManager: TaskManagerService,
    private visitedNodes: VisitedNodesService,
    public frontierNodes: FrontierNodesService) { 
      this.query = `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x4
WHERE {
  ?x0 (^:plocation) ?v0 . ?v0 (^:peditor) ?x1 . 
  ?x1 ((:pauthor/^:pauthor))+ ?x2 . 
  ?x2 ((:peditor/:phomepage/^:phomepage)|(^:pincludes/:pincludes))+ ?x3 . 
  ?x3 (:peditor) ?v1 . ?v1 (:pfollows) ?v2 . ?v2 (^:pfollows) ?x4 . 
}`
    }

  public executeQuery() {
    let node: ExpandTask = this.taskManager.create(null, this.query, null)
    this.serverEval.execute(node, 'http://example.org/datasets/gmark')
    // this.frontierNodes.queue.push(node)
    // let query = "PREFIX : <http://example.org/gmark/> SELECT ?x0 ?x4 WHERE { ?x0 (^:plocation) ?v0 . ?v0 (^:peditor) ?x1 . ?x1 ((:pauthor/^:pauthor))+ ?x2 . ?x2 ((:peditor/:phomepage/^:phomepage)|(^:pincludes/:pincludes))+ ?x3 . ?x3 (:peditor) ?v1 . ?v1 (:pfollows) ?v2 . ?v2 (^:pfollows) ?x4 . }"
    // let next: Node = this.taskManager.add(null, query, null)
    // this.frontierNodes.queue.push(next)
  }

  public expandFrontierNode() {
    let next: ExpandTask = this.frontierNodes.queue.shift()
    let mustExpand: boolean = this.visitedNodes.mustExpand(next.controlTuple)
    while (!mustExpand && this.frontierNodes.queue.length > 0) {
      next = this.frontierNodes.queue.shift()
      mustExpand = this.visitedNodes.mustExpand(next.controlTuple)
    }
    if (mustExpand) {
      this.serverEval.execute(next, 'http://example.org/datasets/gmark')
    }
  }
}
