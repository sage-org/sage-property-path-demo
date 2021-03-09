import { Component, OnInit } from '@angular/core';
import { ExpandTask } from '../models/ExpandTask';
import { FrontierNodesService } from '../services/FrontierNodesService';
import { ServerEvalService } from '../services/ServerEvalService';
import { VisitedNodesService } from '../services/VisitedNodesService';

@Component({
  selector: 'app-waiting-queries',
  templateUrl: './waiting-queries.component.html',
  styleUrls: ['./waiting-queries.component.sass']
})
export class WaitingQueriesComponent implements OnInit {

  constructor(public frontierNodes: FrontierNodesService,
    private visitedNodes: VisitedNodesService,
    private serverEval: ServerEvalService) { }

  ngOnInit(): void {
  }

  public evalNext(): void {
    let next: ExpandTask = this.frontierNodes.queue.shift()
    if (next.controlTuple == null) {
      this.serverEval.execute(next, 'http://example.org/datasets/gmark')
    } else {
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
}
