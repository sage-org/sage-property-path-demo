import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../services/ConfigurationService';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.sass']
})
export class ConfigEditorComponent implements OnInit {

  private graphs = {
    'GMark': 'http://example.org/datasets/gmark',
    'Wikidata2017': 'http://example.org/datasets/wikidata'
  }

  private gmarkQueries = {
    'GMark - Q26': `PREFIX : <http://example.org/gmark/> 
SELECT ?x0 ?x3 
WHERE { 
  ?x0 (^:pdirector) ?v0 . ?v0 (^:ppurchaseFor) ?v1 . ?v1 (^:pmakesPurchase) ?x1 . 
  ?x1 (^:pactor) ?v2 . ?v2 (:pactor) ?x2 . 
  ?x2 ((^:pactor/:pdirector)|(^:pfriendOf))+ ?x3 . 
}`,
    'GMark - Q27': `PREFIX : <http://example.org/gmark/>
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
}`,
    'Creative works with the fictional works that inspired them': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?artWork ?otherWork WHERE {
  ?artWork wdt:P144 ?otherWork .
  ?artWork wdt:P31 ?v . ?v wdt:P279* wd:Q17537576 .
  ?otherWork wdt:P136 wd:Q8253 .
}`
  }

  public selectedQuery: string
  public queryMenuOpen: boolean
  public graphMenuOpen: boolean

  constructor(public configuration: ConfigurationService) { 
    this.selectedQuery = ""
    this.queryMenuOpen = false
    this.graphMenuOpen = false
  }

  ngOnInit(): void {
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
    this.configuration.graph = this.graphs[name]
    this.closeGraphMenu()
  }

  public selectGmarkQuery(name: string): void {
    this.selectedQuery = name
    this.configuration.query = this.gmarkQueries[name]
    this.closeQueryMenu()
  }

  public selectWikidataQuery(name: string): void {
    this.selectedQuery = name
    this.configuration.query = this.wikidataQueries[name]
    this.closeQueryMenu()
  }
}
