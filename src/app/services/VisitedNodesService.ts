import { Injectable } from "@angular/core";
import { Md5 } from 'ts-md5'
import { ControlTuple } from "../models/ControlTuple";

@Injectable()
export class VisitedNodesService {

    public visitedNodes: Map<string, Map<string, number>>

    constructor() {
        this.visitedNodes = new Map<string, Map<string, number>>()
    }

    private buildIdentifier(controlTuple: ControlTuple): string {
        let id = `${JSON.stringify(controlTuple.context)}${controlTuple.path.predicate}`
        return Md5.hashStr(id).toString()
    }

    public mustExpand(controlTuple: ControlTuple): boolean {
        if (controlTuple.depth < controlTuple.max_depth) {
            return false
        } else {
            let id: string = this.buildIdentifier(controlTuple)
            let depth: number = this.visitedNodes.get(id).get(controlTuple.node)
            return depth === controlTuple.depth
        }
    }

    public hasBeenVisited(controlTuple: ControlTuple): boolean {
        let id: string = this.buildIdentifier(controlTuple)
        if (this.visitedNodes.has(id)) {
            return this.visitedNodes.get(id).has(controlTuple.node)
        } else {
            return false
        }
    }

    public markAsVisited(controlTuple: ControlTuple): void {
        let id: string = this.buildIdentifier(controlTuple)
        if (!this.visitedNodes.has(id)) {
            this.visitedNodes.set(id, new Map<string, number>())
        }
        this.visitedNodes.get(id).set(controlTuple.node, controlTuple.depth)
    }

    public updateVisitedDepth(controlTuple: ControlTuple): void {
        if (!this.hasBeenVisited(controlTuple)) {
            this.markAsVisited(controlTuple)
        } else {
            let id: string = this.buildIdentifier(controlTuple)
            let depth: number = this.visitedNodes.get(id).get(controlTuple.node)
            this.visitedNodes.get(id).set(controlTuple.node, Math.min(depth, controlTuple.depth))
        }
    }
}