import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../app-settings";
import { ExpandTask } from "../models/ExpandTask";
import { InlineControlTuple } from "../models/InlineControlTuple";
import { SageQueryBody } from "../models/SageQueryBody";
import { SageResponse } from "../models/SageResponse";
import { FrontierNodesService } from "./FrontierNodesService";
import { MonitoringService } from "./MonitoringService";
import { SolutionMappingsService } from "./SolutionMappingsService";
import { SpyService } from "./SpyService";
import { VisitedNodesService } from "./VisitedNodesService";
import * as BF from 'buffer';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ServerEvalService {

    private stopExecution: boolean
    private busy: boolean

    private statsUpdated: BehaviorSubject<boolean>
    public onStatsUpdated: Observable<boolean> 

    constructor(private httpClient: HttpClient, 
        private solutions: SolutionMappingsService,
        private spy: SpyService,
        private visitedNodes: VisitedNodesService,
        private frontierNodes: FrontierNodesService,
        private monitoring: MonitoringService) { 
            this.busy = false
            this.statsUpdated = new BehaviorSubject<boolean>(false)
            this.onStatsUpdated = this.statsUpdated.asObservable()
        }

    public async execute(node: ExpandTask, graph: string) {
        try {
            this.busy = true
            this.stopExecution = false
            this.monitoring.progression = 0
            await this.excuteQuery(node, graph)
            this.frontierNodes.refresh()
            this.busy = false
        } catch (error) {
            console.log(error)
            this.busy = false
            throw error
        }
    }

    public stop(): void {
        this.stopExecution = true
    }

    public isBusy(): boolean {
        return this.busy
    }

    private async excuteQuery(node: ExpandTask, graph: string) {
        let hasNext = true
        let next = null
        while (hasNext) {
            let startTime: number = Date.now()
            let response: SageResponse = await this.queryWithRetryPolicy(node.query, graph, next)
            if (this.stopExecution) {
                break
            }
            // Updates metrics
            this.spy.nbCalls++
            this.spy.dataTransfer += new TextEncoder().encode(JSON.stringify(response)).length
            this.spy.sizeSolutionMappings += BF.Buffer.byteLength(JSON.stringify(response.bindings), 'utf-8') - 2
            this.spy.sizeControlTuples += BF.Buffer.byteLength(JSON.stringify(response.controls), 'utf-8') - 2
            // Updates solution mappings
            this.solutions.addAll(response.bindings)
            // Computes control tuples
            for (let compactControlTuple of response.controls) {
                for (let visitedNode of compactControlTuple.nodes) {
                    let inlineControlTuple: InlineControlTuple = {
                        path_pattern_id: compactControlTuple.path_pattern_id,
                        context: compactControlTuple.context,
                        node: visitedNode.node,
                        depth: visitedNode.depth,
                        forward: compactControlTuple.forward,
                        max_depth: compactControlTuple.max_depth
                    }
                    if (this.visitedNodes.hasBeenVisited(inlineControlTuple)) {
                        this.visitedNodes.updateVisitedDepth(inlineControlTuple)
                    } else {
                        this.visitedNodes.markAsVisited(inlineControlTuple)
                        if (this.visitedNodes.mustExpand(inlineControlTuple)) {
                            this.frontierNodes.expand(node, inlineControlTuple)
                        }
                    }
                }
            }
            next = response.next
            hasNext = next != null
            this.spy.executionTime += Date.now() - startTime
            this.statsUpdated.next(true)
            if (hasNext) {
                this.monitoring.estimateProgress(next)
            } else {
                this.monitoring.progression = 100
            }
        }
    }

    private async queryWithRetryPolicy(query: string, graph: string, next: string, retry=10): Promise<SageResponse> {
        try {
            return await this.query(query, graph, next)
        } catch (error) {
            if (retry > 0) {
                return await this.queryWithRetryPolicy(query, graph, next, retry=retry-1)
            } else {
                console.error(error)
                throw error
            }
        }
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
                resolve(response)
            }, (error: any) => {
                reject(error)
            })
        })
    }
}