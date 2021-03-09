import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.sass']
})
export class QueryEditorComponent implements OnInit {

  public codeMirrorOptions: any = {
    mode: "application/sparql-query",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  }

  @Input() public query: string
  @Output() public queryChange = new EventEmitter<string>()

  @Input() public graph: string
  @Output() public graphChange = new EventEmitter<string>()

  @Input() public quantum: number
  @Output() public quantumChange = new EventEmitter<number>()

  @Input() public maxDepth: number
  @Output() public maxDepthChange = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
  }

  public onQueryChange(): void {
    this.queryChange.emit(this.query)
  }

  public onGraphChange(): void {
    this.graphChange.emit(this.graph)
  }

  public onQuantumChange(): void {
    this.quantumChange.emit(this.quantum)
  }

  public onMaxDepthChange(): void {
    this.maxDepthChange.emit(this.maxDepth)
  }
}
