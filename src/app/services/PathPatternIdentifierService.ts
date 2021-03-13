import { Injectable } from "@angular/core";
import { IriTerm, PropertyPath, SelectQuery, Triple } from "sparqljs";
import { Md5 } from 'ts-md5';
import { PathPattern } from "../models/PathPattern";
import { isPropertyPath, parseQuery } from "../utils";

@Injectable()
export class PathPatternIdentifierService {

    private identifiers: Map<string, string>

    constructor() {
        this.identifiers = new Map<string, string>()
    }

    private formatPropertyPath(path: PropertyPath | IriTerm): string {
        if (isPropertyPath(path)) {
            switch (path.pathType) {
                case '^':
                    return `Path(~${this.formatPropertyPath(path.items[0])})`
                case '/':
                    let sequence_items = path.items.map((subpath) => this.formatPropertyPath(subpath))
                    return `Path(${sequence_items.join(' / ')})`
                case '|':
                    let alternative_items = path.items.map((subpath) => this.formatPropertyPath(subpath))
                    return `Path(${alternative_items.join(' | ')})`
                case '+':
                    return `Path(${this.formatPropertyPath(path.items[0])}+)`
                case '*':
                    return `Path(${this.formatPropertyPath(path.items[0])}*)`
                default:
                    return '' // should not happen
            }
        } else {
            return path.value
        }
    }

    public getTripleIdentifier(triple: Triple): string {
        let subject: string = ""
        let predicate: string = ""
        let object: string = ""
        if (triple.subject.termType == "Variable") {
            subject = '?' + triple.subject.value
        } else {
            subject = triple.subject.value
        }
        if (isPropertyPath(triple.predicate)) {
            predicate = this.formatPropertyPath(triple.predicate)
        }
        if (triple.object.termType == "Variable") {
            object = '?' + triple.object.value
        } else {
            object = triple.object.value
        }
        return Md5.hashStr(`${subject}${predicate}${object}`) as string
    }

    public registerOriginalQueryPathPatterns(query: string): void {
        let queryPlan: SelectQuery = parseQuery(query)
        for (let clause of queryPlan.where) {
            if (clause.type == 'bgp') {
                for (let triple of clause.triples) {
                    let identifier = this.getTripleIdentifier(triple)
                    this.identifiers.set(identifier, identifier)
                }
            }
        }
    }

    public registerRewritedPathPattern(triple: Triple, rewritedTriple: Triple): void {
        let tripleIdentifier = this.getTripleIdentifier(triple)
        let rewritedTripleIdentifier = this.getTripleIdentifier(rewritedTriple)
        this.identifiers.set(rewritedTripleIdentifier, this.getOriginalPathPatternIdentifier(tripleIdentifier))
    }

    public getOriginalPathPatternIdentifier(identifier: string): string {
        return this.identifiers.get(identifier)
    }
}