import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../app-settings";
import { ExpandTask } from "../models/ExpandTask";
import { SageQueryBody } from "../models/SageQueryBody";
import { SageResponse } from "../models/SageResponse";
import { FrontierNodesService } from "./FrontierNodesService";
import { SolutionMappingsService } from "./SolutionMappingsService";
import { SpyService } from "./SpyService";
import { VisitedNodesService } from "./VisitedNodesService";

@Injectable()
export class ServerEvalService {

    constructor(private httpClient: HttpClient, 
        private solutions: SolutionMappingsService,
        private spy: SpyService,
        private visitedNodes: VisitedNodesService,
        private frontierNodes: FrontierNodesService) { }

    private updateMetrics(response: SageResponse): void {
        this.spy.nbCalls++
        this.spy.dataTransfer += new TextEncoder().encode(JSON.stringify(response)).length
        this.spy.sizeSolutionMappings += new TextEncoder().encode(JSON.stringify(response.bindings)).length
        this.spy.sizeControlTuples += new TextEncoder().encode(JSON.stringify(response.controls)).length
    }

    public async execute(node: ExpandTask, graph: string) {
        console.log(node.query)
        let hasNext = true
        let next = null
        let startTime: number = Date.now()
        while (hasNext) {
            let response: SageResponse = await this.query(node.query, graph, next)
            this.updateMetrics(response)
            this.solutions.addAll(response.bindings)
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
        }
        let elapsedTime: number = Date.now() - startTime
        this.spy.executionTime += elapsedTime
        console.log(this.solutions.results)
        console.log(this.frontierNodes.queue)
        console.log(this.visitedNodes.visitedNodes)
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
            this.httpClient.post(AppSettings.SAGE_ENDPOINT, body, { headers }).subscribe((response: SageResponse) => {                
                console.log(response)
                resolve(response)
            }, (error: any) => {
                reject(error)
            })
        })
        
    }
}