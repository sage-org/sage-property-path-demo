import { Injectable } from "@angular/core";
import { SelectQuery, Triple, BindPattern } from 'sparqljs'
import { ExpandTask } from "../models/ExpandTask";
import { TaskManagerService } from "./TaskManagerService";
import { VisitedNodesService } from "./VisitedNodesService";
import { InlineControlTuple } from "../models/InlineControlTuple";
import { PathPatternIdentifierService } from "./PathPatternIdentifierService";
import { createBgpPattern, createBindPattern, createIri, extractTriples, generateQuery, isVariable, parseQuery } from "../utils";

@Injectable()
export class FrontierNodesService {

    public queue: Array<ExpandTask>

    constructor(private taskManager: TaskManagerService, 
        private visitedNodes: VisitedNodesService,
        private patternsIdentifier: PathPatternIdentifierService) {
        this.queue = new Array<ExpandTask>()
    }

    private isFullyBoundedPattern(triple: Triple, boundedVariables: Array<string>): boolean {
        if (isVariable(triple.subject) && !boundedVariables.includes(triple.subject.value)) {
            return false
        } else if (isVariable(triple.object) && !boundedVariables.includes(triple.object.value)) {
            return false
        } else {
            return true
        }
    }

    public expand(node: ExpandTask, controlTuple: InlineControlTuple): void {
        let queryPlan: SelectQuery = parseQuery(node.query)
        let expandedQuery: SelectQuery = {
            type: 'query',
            queryType: 'SELECT',
            prefixes: queryPlan.prefixes,
            variables: queryPlan.variables,
            where: []
        }
        let boundedVariables: Array<string> = []
        for (let [variable, value] of Object.entries(controlTuple.context)) {
            boundedVariables.push(variable.slice(1))
            let bindClause: BindPattern = createBindPattern(variable.slice(1), value)
            expandedQuery.where.push(bindClause)
        }
        let triples: Array<Triple> = extractTriples(queryPlan)
        let expandedTriples = new Array<Triple>() 
        let patternFound = false
        for (let triple of triples) {
            let tripleIdentifier = this.patternsIdentifier.buildIdentifier(triple)
            if (tripleIdentifier == controlTuple.path_pattern_id) {
                patternFound = true
                let rewritedTriple: Triple = {
                    subject: controlTuple.forward ? createIri(controlTuple.node) : triple.subject,
                    predicate: triple.predicate,
                    object: controlTuple.forward ? triple.object : createIri(controlTuple.node)
                }
                let rewritedTripleIdentifier = this.patternsIdentifier.buildIdentifier(rewritedTriple)
                this.patternsIdentifier.sameAs(tripleIdentifier, rewritedTripleIdentifier)
                expandedTriples.push(rewritedTriple)
            } else if (!this.isFullyBoundedPattern(triple, boundedVariables)) {
                expandedTriples.push(triple)
            } 
        }
        if (!patternFound) { // should not happen
            throw new Error(`Path pattern not found for the control tuple: ${JSON.stringify(controlTuple)}`)
        }
        expandedQuery.where.push(createBgpPattern(expandedTriples))
        this.queue.push(this.taskManager.create(node, generateQuery(expandedQuery), controlTuple))
    }   

    public refresh(): void {
        this.queue = this.queue.filter((task: ExpandTask) => {
            return this.visitedNodes.mustExpand(task.controlTuple)
        })
    }

    public clear(): void {
        this.queue = new Array<ExpandTask>()
    }
}