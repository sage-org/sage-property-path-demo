import { BgpPattern, BindPattern, BlankTerm, Expression, Generator, IriTerm, LiteralTerm, OperationExpression, Parser, PropertyPath, QuadTerm, SelectQuery, SparqlQuery, Term, Triple, Variable, VariableExpression, VariableTerm, Wildcard } from "sparqljs";

export function isPropertyPath(predicate: IriTerm | VariableTerm | PropertyPath): predicate is PropertyPath {
    return (predicate as PropertyPath).type == 'path'
}

export function parseQuery(query: string): SelectQuery {
    let queryPlan: SparqlQuery = new Parser().parse(query)
    if (queryPlan.type == 'query' && queryPlan.queryType == 'SELECT') {
        return queryPlan
    } else {
        return null // should not happen
    }
}

export function generateQuery(query: SelectQuery): string {
    return new Generator().stringify(query)
}

export function extractTriples(query: SelectQuery): Array<Triple> {
    for (let clause of query.where) {
        if (clause.type == 'bgp') {
            return clause.triples
        }
    }
    return [] // should not happen
}

export function createVariable(name: string): VariableTerm {
        return {
            termType: 'Variable',
            value: name,
            equals: (other: Term) => true
        }
}

export function createIri(value: string): IriTerm {
    return {
        termType: 'NamedNode',
        value: value,
        equals: (other: Term) => true
    }
}

export function createLiteral(value: string): LiteralTerm {
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

export function createIriOperation(value: string): OperationExpression {
    return {
        type: 'operation',
        operator: 'iri',
        args: [ createIri(value) ]
    }
}

export function createStrOperation(value: string): OperationExpression {
    return {
        type: 'operation',
        operator: 'str',
        args: [ createLiteral(value) ]
    }
}

export function createBindPattern(variable: string, value: string): BindPattern {
    let expression: Expression
    if (value.startsWith('http')) {
        expression = createIriOperation(value)
    } else {
        expression = createStrOperation(value)
    }
    return {
        type: 'bind',
        variable: createVariable(variable),
        expression: expression
    }
}

export function createBgpPattern(triples: Array<Triple>): BgpPattern {
    return {
        type: 'bgp',
        triples: triples
    }
}

export function isVariable(term: Term | IriTerm | BlankTerm | VariableTerm | QuadTerm): term is VariableTerm {
    return (term as VariableTerm).termType === 'Variable'
}

export function isSupportedQuery(query: string): boolean {
    try {
        let queryPlan: SelectQuery = parseQuery(query)
        if (!queryPlan.where) {
            return false
        }
        for (let variable of queryPlan.variables) {
            if ((variable as VariableTerm).termType != 'Variable' && (variable as Wildcard).termType != 'Wildcard') {
                return false
            }
        }
        for (let clause of queryPlan.where) {
            if (clause.type != 'bgp' && clause.type != 'bind') {
                return false
            } else if (clause.type == 'bgp') {
                for (let triple of clause.triples) {
                    if (isPropertyPath(triple.predicate) && (triple.predicate.pathType == '/' || triple.predicate.pathType == '|')) {
                        console.log("not support property path")
                        return false
                    } 
                }
            }
        }
        return true
    } catch (error) {
        return false 
    }
}