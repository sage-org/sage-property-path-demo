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

  private graphs = {
    'GMark': 'http://example.org/datasets/gmark',
    'Wikidata2017': 'http://example.org/datasets/wikidata'
  }

  private gmarkQueries = {
    'Gmark - Query 1': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x4
WHERE {
  ?x0 (^:plocation) ?v0 . ?v0 (^:peditor) ?x1 . 
  ?x1 ((:pauthor/^:pauthor))+ ?x2 . 
  ?x2 ((:peditor/:phomepage/^:phomepage)|(^:pincludes/:pincludes))+ ?x3 . 
  ?x3 (:peditor) ?v1 . ?v1 (:pfollows) ?v2 . ?v2 (^:pfollows) ?x4 . 
}`
  }

  private wikidataQueries = {
    'Female scientists': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?item WHERE {
    ?item wdt:P31 wd:Q5 .
    ?item wdt:P21 wd:Q6581072 .
    ?item wdt:P106 ?v . ?v wdt:P279* wd:Q901 .
}`,
    'Public scultures in Paris': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?item
WHERE {
  ?item wdt:P31 ?v . ?v wdt:P279* wd:Q860861.           
  ?item wdt:P136 wd:Q557141 . 
  ?item wdt:P131 wd:Q90.
}`
  }

  public selectedQuery: string
  public queryMenuOpen: boolean
  public graphMenuOpen: boolean

  @Input() public query: string
  @Output() public queryChange = new EventEmitter<string>()

  @Input() public graph: string
  @Output() public graphChange = new EventEmitter<string>()

  @Input() public quantum: number
  @Output() public quantumChange = new EventEmitter<number>()

  @Input() public maxDepth: number
  @Output() public maxDepthChange = new EventEmitter<number>()

  constructor() { 
    this.selectedQuery = ""
    this.queryMenuOpen = false
    this.graphMenuOpen = false
  }

  ngOnInit(): void {
    this.quantum = 1500
    this.maxDepth = 5
  }

  public listGraphs(): Array<string> {
    return Object.keys(this.graphs)
  }

  public listGmarkQueries(): Array<string> {
    return Object.keys(this.gmarkQueries)
  }

  public listWikidataQueries(): Array<string> {
    return Object.keys(this.wikidataQueries)
  }

  public openGraphMenu(): void {
    this.graphMenuOpen = true
  }

  public closeGraphMenu(): void {
    this.graphMenuOpen = false
  }

  public closeQueryMenu(): void {
    this.queryMenuOpen = false
  }

  public openQueryMenu(): void {
    this.queryMenuOpen = true
  }

  public selectGraph(name: string): void {
    this.graph = this.graphs[name]
    this.closeGraphMenu()
    this.onGraphChange()
  }

  public selectGmarkQuery(name: string): void {
    this.selectedQuery = name
    this.query = this.gmarkQueries[name]
    this.closeQueryMenu()
    this.onQueryChange()
  }

  public selectWikidataQuery(name: string): void {
    this.selectedQuery = name
    this.query = this.wikidataQueries[name]
    this.closeQueryMenu()
    this.onQueryChange()
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
