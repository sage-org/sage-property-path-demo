import { Injectable } from "@angular/core";
import { IriTerm, PropertyPath, Triple } from "sparqljs";
import { Md5 } from 'ts-md5';
import { isPropertyPath } from "../utils";

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

    public buildIdentifier(triple: Triple): string {
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
        let identifier = Md5.hashStr(`${subject}${predicate}${object}`) as string
        if (!this.identifiers.has(identifier)) { // this is the original query path pattern
            this.identifiers.set(identifier, identifier)
        }
        return identifier
    }

    public sameAs(parentIdentifier: string, childIdentifier: string): void {
        let rootIdentifier = this.get(parentIdentifier) // get the identifier of the original query path pattern
        this.identifiers.set(childIdentifier, rootIdentifier) // put a "sameAs" link between the two patterns
    }

    public get(identifier: string): string {
        return this.identifiers.get(identifier)
    }
}