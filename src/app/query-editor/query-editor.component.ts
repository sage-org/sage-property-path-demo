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

  constructor() { 
    // this.onExecuteQuery = new EventEmitter<string>()
//     this.query = `PREFIX : <http://example.org/gmark/>
// SELECT ?x0 ?x4
// WHERE {
//   ?x0 (^:plocation) ?v0 . ?v0 (^:peditor) ?x1 . 
//   ?x1 ((:pauthor/^:pauthor))+ ?x2 . 
//   ?x2 ((:peditor/:phomepage/^:phomepage)|(^:pincludes/:pincludes))+ ?x3 . 
//   ?x3 (:peditor) ?v1 . ?v1 (:pfollows) ?v2 . ?v2 (^:pfollows) ?x4 . 
// }`
  }

  ngOnInit(): void {
  }

  public onQueryChange() {
    this.queryChange.emit(this.query)
  }

  // public executeQuery(): void {
  //   this.onExecuteQuery.emit(this.query)
  // }
}
