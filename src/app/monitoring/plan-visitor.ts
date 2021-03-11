export class PlanVisitor {
    
    public visitRoot(node: any) {
        this.visitChildren(node, 'Source')
    }
  
    protected visitChildren(node: any, suffix = 'Source') {
        console.log(node, suffix)
        if (`proj${suffix}` in node) {
            this.visitProjection(node[`proj${suffix}`])
        } else if (`scan${suffix}` in node) {
            this.visitScan(node[`scan${suffix}`])
        } else if (`join${suffix}` in node) {
            this.visitIndexJoin(node[`join${suffix}`])
        } else if (`union${suffix}` in node) {
            this.visitBagUnion(node[`union${suffix}`])
        } else if (`filter${suffix}` in node) {
            this.visitFilter(node[`filter${suffix}`])
        } else if (`bind${suffix}` in node) {
            this.visitBind(node[`bind${suffix}`])
        } else if (`piggyback${suffix}` in node) {
            this.visitPiggyback(node[`piggyback${suffix}`])
        } else if (`transitiveClosure${suffix}` in node) {
            this.visitTransitiveClosure(node[`transitiveClosure${suffix}`])
        }
    }
  
    protected visitScan(node: any): void {}
  
    protected visitProjection(node: any): void {
        this.visitChildren(node, 'Source')
    }

    protected visitBind(node: any): void {
        this.visitChildren(node, 'Source')
    }
  
    protected visitIndexJoin(node: any): void {
        this.visitChildren(node, 'Left')
        this.visitChildren(node, 'Right')
    }
  
    protected visitFilter(node: any): void {
        this.visitChildren(node, 'Source')
    }
  
    protected visitBagUnion(node: any): void {
        if ('reflexiveClosureLeft' in node) {
            this.visitChildren(node, 'Right')
        } else {
            this.visitChildren(node, 'Left')
            this.visitChildren(node, 'Right')
        }
    }

    protected visitPiggyback(node: any): void {
        this.visitChildren(node, 'Source')
    }

    protected visitTransitiveClosure(node: any): void {
        this.visitChildren(node.iterators[0], 'Iterator')
    }
}