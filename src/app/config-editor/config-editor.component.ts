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
    'GMark - Q1': `PREFIX : <http://example.org/gmark/>
SELECT ?x0
WHERE {
  ?x0 (:peditor) ?v0 . ?v0 (:plike) ?v1 . ?v1 (:phasReview) ?x1 .
  ?x1 (^:phasReview) ?v2 . ?v2 (:partist) ?x2 .
  ?x2 (:pfriendOf)+ ?x3 .
}`,
    'GMark - Q2': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 WHERE {
  ?x0 (^:pexpires) ?x1 .
  ?x1 (:pauthor) ?v0 . ?v0 (^:peditor) ?x2 .
  ?x2 ((:peditor/^:pauthor))+ ?x3 .
  ?x3 (^:pincludes) ?v1 . ?v1 (:pincludes) ?x4 .
}`,
    'GMark - Q3': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x2
WHERE {
  ?x1 (^:pconductor) ?v0 . ?v0 (:phomepage) ?v1 . ?v1 (^:phomepage) ?x2 .
  ?x0 (((:pfriendOf)))+ ?x1 .
}`,
    'GMark - Q4': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x3
WHERE {
  ?x0 (^:pdirector) ?v0 . ?v0 (^:ppurchaseFor) ?v1 . ?v1 (^:pmakesPurchase) ?x1 .
  ?x1 (^:pactor) ?v2 . ?v2 (:pactor) ?x2 .
  ?x2 ((^:pactor/:pdirector)|(^:pfriendOf))+ ?x3 .
}`,
    'GMark - Q5': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x4
WHERE {
  ?x0 (^:plocation) ?v0 . ?v0 (^:peditor) ?x1 .
  ?x1 ((:pauthor/^:pauthor))+ ?x2 .
  ?x2 ((:peditor/:phomepage/^:phomepage)|(^:pincludes/:pincludes))+ ?x3 .
  ?x3 (:peditor) ?v1 . ?v1 (:pfollows) ?v2 . ?v2 (^:pfollows) ?x4 .
}`,
    'GMark - Q6': `PREFIX : <http://example.org/gmark/>
SELECT ?x0 ?x1 ?x2 ?x3
WHERE {
  ?x0 (^:peditor) ?v0 . ?v0 (:peditor) ?v1 . ?v1 (^:pfriendOf) ?x1 .
  ?x0 (:plike) ?v2 . ?v2 (^:plike) ?v3 . ?v3 (^:previewer) ?v4 . ?v4 (:previewer) ?x2 .
  ?x1 ((:pfriendOf)|(^:peditor/:phomepage/^:phomepage))+ ?x3 .
}`
  }

  private wikidataQueries = {
    'Female scientists': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?scientist WHERE {
    ?scientist wdt:P31 wd:Q5 .
    ?scientist wdt:P21 wd:Q6581072 .
    ?scientist wdt:P106 ?class . ?class wdt:P279* wd:Q901 .
}`, 'Coat of arms image of all places located in Germany': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?place ?coatArms
WHERE {
  ?place wdt:P94 ?coatArms;
    (wdt:P131*) wd:Q183.
}`,
    'Creative works with the fictional works that inspired them': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?artWork ?otherWork WHERE {
  ?artWork wdt:P144 ?otherWork .
  ?artWork wdt:P31 ?v . ?v wdt:P279* wd:Q17537576 .
  ?otherWork wdt:P136 wd:Q8253 .
}`,
    'All chemicals with their manufacturer': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?chemical ?manufacturer
WHERE {
  ?chemical wdt:P31 ?class .
  ?class wdt:P279* wd:Q11173 .
  ?chemical wdt:P176 ?manufacturer .
}`,
    'All events with for each the wikipedia page about it': `PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT ?event ?date ?article
WHERE {
  ?event wdt:P31 ?class .
  ?class wdt:P279* wd:Q1190554 .
  ?event wdt:P585 ?date .
  ?article <http://schema.org/about> ?event .
  ?article <http://schema.org/isPartOf>  <https://de.wikipedia.org/> .
}`
  }

  public selectedQuery: string
  public queryMenuOpen: boolean
  public graphMenuOpen: boolean

  constructor(public configuration: ConfigurationService) { }

  ngOnInit(): void {
    this.selectedQuery = ""
    this.queryMenuOpen = false
    this.graphMenuOpen = false
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
