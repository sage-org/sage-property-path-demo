import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ExpandTask } from '../models/ExpandTask';
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

  constructor(private route: ActivatedRoute, private router: Router, private taskManager: TaskManagerService) { }

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

  public contextVariables(): Array<string> {
    return Object.keys(this.task.controlTuple.context)
  }

  public contextMappings(): Array<string> {
    return Object.values(this.task.controlTuple.context)
  }
}
