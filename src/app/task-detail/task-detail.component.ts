import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ExpandTask } from '../models/ExpandTask';
import { PathPattern } from '../models/PathPattern';
import { PathPatternIdentifierService } from '../services/PathPatternIdentifierService';
import { TaskManagerService } from '../services/TaskManagerService';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.sass']
})
export class TaskDetailComponent implements OnInit {

  public codeMirrorOptions: any = {
    mode: "application/sparql-query",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  }

  public parent: ExpandTask
  public task: ExpandTask

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private taskManager: TaskManagerService,
    private patternsIdentifier: PathPatternIdentifierService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let taskName: string = params['taskName']
      this.task = this.taskManager.get(taskName) 
      this.parent = this.taskManager.parent(taskName)
      if (!this.task) {
        this.router.navigate(['/'])
      }
    })
  }

  public navigateToParent(): void {
    this.router.navigate(['/tasks', this.parent.name])
  }

  public getContextVariables(): Array<string> {
    return Object.keys(this.task.controlTuple.context)
  }

  public getContextMappings(): Array<string> {
    return Object.values(this.task.controlTuple.context)
  }

  public getPathPattern(): PathPattern {
    return this.patternsIdentifier.getTriple(this.task.controlTuple.path_pattern_id)
  }
}
