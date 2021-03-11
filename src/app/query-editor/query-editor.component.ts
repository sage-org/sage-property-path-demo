import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../services/ConfigurationService';

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

  constructor(public configuration: ConfigurationService) { }

  ngOnInit(): void {
  }
}