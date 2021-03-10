import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../app-settings";
import { ExpandTask } from "../models/ExpandTask";
import { SageQueryBody } from "../models/SageQueryBody";
import { SageResponse } from "../models/SageResponse";
import { FrontierNodesService } from "./FrontierNodesService";
import { MonitoringService } from "./MonitoringService";
import { SolutionMappingsService } from "./SolutionMappingsService";
import { SpyService } from "./SpyService";
import { VisitedNodesService } from "./VisitedNodesService";

@Injectable()
export class ServerEvalService {

    private stopExecution: boolean

    constructor(private httpClient: HttpClient, 
        private solutions: SolutionMappingsService,
        private spy: SpyService,
        private visitedNodes: VisitedNodesService,
        private frontierNodes: FrontierNodesService,
        private monitoring: MonitoringService) { }

    public async execute(node: ExpandTask, graph: string) {
        console.log(node.query)
        this.stopExecution = false
        this.monitoring.progression = 0
        let hasNext = true
        let next = null
        let startTime: number = Date.now()
        while (hasNext && !this.stopExecution) {
            let response: SageResponse = await this.query(node.query, graph, next)
            // Updates metrics
            this.spy.executionTime += Date.now() - startTime
            this.spy.nbCalls++
            this.spy.dataTransfer += new TextEncoder().encode(JSON.stringify(response)).length
            this.spy.sizeSolutionMappings += new TextEncoder().encode(JSON.stringify(response.bindings)).length
            this.spy.sizeControlTuples += new TextEncoder().encode(JSON.stringify(response.controls)).length
            // Updates solution mappings
            this.solutions.addAll(response.bindings)
            // Computes control tuples
            for (let controlTuple of response.controls) {
                if (this.visitedNodes.hasBeenVisited(controlTuple)) {
                    this.visitedNodes.updateVisitedDepth(controlTuple)
                } else {
                    this.visitedNodes.markAsVisited(controlTuple)
                    if (this.visitedNodes.mustExpand(controlTuple)) {
                        this.frontierNodes.expand(node, controlTuple)
                    }
                }
            }
            hasNext = response.hasNext
            next = response.next
            if (hasNext) {
                this.monitoring.estimateProgress(next)
            } else {
                this.monitoring.progression = 100
            }
        }
        this.frontierNodes.refresh()
        console.log(this.solutions.results)
        console.log(this.frontierNodes.queue)
        console.log(this.visitedNodes.visitedNodes)
    }

    public stop(): void {
        this.stopExecution = true
    }

    private query(query: string, graph: string, next: string): Promise<SageResponse> {
        let body: SageQueryBody = {
            query: query,
            defaultGraph: graph,
            next: next
        }        
        let headers = new HttpHeaders({
            'ContentType': 'application/json'
        })
        return new Promise<SageResponse>((resolve, reject) => {
            let url: string = `${AppSettings.SAGE_ENDPOINT}/sparql`
            this.httpClient.post(url, body, { headers }).subscribe((response: SageResponse) => {                
                console.log(response)
                resolve(response)
            }, (error: any) => {
                reject(error)
            })
        })
    }
}