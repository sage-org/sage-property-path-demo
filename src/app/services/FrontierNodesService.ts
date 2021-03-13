import { Injectable } from "@angular/core";
import { Parser, Generator, SparqlQuery, SelectQuery, Triple, Term, BindPattern, VariableTerm, OperationExpression, LiteralTerm, BgpPattern, IriTerm, BlankTerm, QuadTerm, Expression } from 'sparqljs'
import { ExpandTask } from "../models/ExpandTask";
import { TaskManagerService } from "./TaskManagerService";
import { VisitedNodesService } from "./VisitedNodesService";
import { InlineControlTuple } from "../models/InlineControlTuple";
import { PathPatternIdentifierService } from "./PathPatternIdentifierService";

@Injectable()
export class FrontierNodesService {

    public queue: Array<ExpandTask>

    constructor(private taskManager: TaskManagerService, 
        private visitedNodes: VisitedNodesService,
        private patternsIdentifier: PathPatternIdentifierService) {
        this.queue = new Array<ExpandTask>()
    }

    private parseQuery(query: string): SelectQuery {
        let queryPlan: SparqlQuery = new Parser().parse(query)
        if (queryPlan.type == 'query' && queryPlan.queryType == 'SELECT') {
            return queryPlan
        } else {
            return null // should not happen
        }
    }

    private extractTriples(query: SelectQuery): Array<Triple> {
        for (let clause of query.where) {
            if (clause.type == 'bgp') {
                return clause.triples
            }
        }
        return [] // should not happen
    }

    private createVariable(name: string): VariableTerm {
            return {
                termType: 'Variable',
                value: name,
                equals: (other: Term) => true
            }
    }

    private createIri(value: string): IriTerm {
        return {
            termType: 'NamedNode',
            value: value,
            equals: (other: Term) => true
        }
    }

    private createLiteral(value: string): LiteralTerm {
        return {
            termType:'Literal',
            datatype: {
                termType: 'NamedNode',
                value: 'http://www.w3.org/2001/XMLSchema#string',
                equals: (other: Term) => true
            },
            language: '',
            value: value,
            equals: (other: Term) => true
        }
    }

    private createIriOperation(value: string): OperationExpression {
        return {
            type: 'operation',
            operator: 'iri',
            args: [ this.createIri(value) ]
        }
    }

    private createStrOperation(value: string): OperationExpression {
        return {
            type: 'operation',
            operator: 'str',
            args: [ this.createLiteral(value) ]
        }
    }

    private createBindPattern(variable: string, value: string): BindPattern {
        let expression: Expression
        if (value.startsWith('http')) {
            expression = this.createIriOperation(value)
        } else {
            expression = this.createStrOperation(value)
        }
        return {
            type: 'bind',
            variable: this.createVariable(variable),
            expression: expression
        }
    }

    private createBgpPattern(triples: Array<Triple>): BgpPattern {
        return {
            type: 'bgp',
            triples: triples
        }
    }

    private isVariable(term: Term | IriTerm | BlankTerm | VariableTerm | QuadTerm): term is VariableTerm {
        return (term as VariableTerm).termType === 'Variable'
    }

    private isFullyBoundedPattern(triple: Triple, boundedVariables: Array<string>): boolean {
        if (this.isVariable(triple.subject) && !boundedVariables.includes(triple.subject.value)) {
            return false
        } else if (this.isVariable(triple.object) && !boundedVariables.includes(triple.object.value)) {
            return false
        } else {
            return true
        }
    }

    public expand(node: ExpandTask, controlTuple: InlineControlTuple): void {
        let queryPlan: SelectQuery = this.parseQuery(node.query)
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
            let bindClause: BindPattern = this.createBindPattern(variable.slice(1), value)
            expandedQuery.where.push(bindClause)
        }
        let triples: Array<Triple> = this.extractTriples(queryPlan)
        let expandedTriples = new Array<Triple>() 
        let patternFound = false
        for (let triple of triples) {
            let tripleIdentifier = this.patternsIdentifier.buildIdentifier(triple)
            if (tripleIdentifier == controlTuple.path_pattern_id) {
                patternFound = true
                let rewritedTriple: Triple = {
                    subject: controlTuple.forward ? this.createIri(controlTuple.node) : triple.subject,
                    predicate: triple.predicate,
                    object: controlTuple.forward ? triple.object : this.createIri(controlTuple.node)
                }
                let rewritedTripleIdentifier = this.patternsIdentifier.buildIdentifier(rewritedTriple)
                this.patternsIdentifier.sameAs(tripleIdentifier, rewritedTripleIdentifier)
                expandedTriples.push(rewritedTriple)
            } else if (!this.isFullyBoundedPattern(triple, boundedVariables)) {
                expandedTriples.push(triple)
            } 
        }
        if (!patternFound) {
            throw new Error(`Path pattern not found for the control tuple: ${JSON.stringify(controlTuple)}`)
        }
        expandedQuery.where.push(this.createBgpPattern(expandedTriples))
        this.queue.push(this.taskManager.create(node, new Generator().stringify(expandedQuery), controlTuple))
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