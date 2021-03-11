import { IriTerm, PropertyPath, VariableTerm } from "sparqljs";

export function isPropertyPath(predicate: IriTerm | VariableTerm | PropertyPath): predicate is PropertyPath {
    return (predicate as PropertyPath).type == 'path'
}