class Node {
    constructor (val) {
        this.val = val;
        this.depth = 0;
        this.left = undefined;
        this.right = undefined;
        this.parent = null;
    }

    get children () {
        const c = [];
        if (this.left) c.push(this.left)
        if (this.right) c.push(this.right)
        return c;
    }

    addChild (child) {
        if (!this.left) this.left = child;
        else if (!this.right) this.right = child;
        else return false;
        this.adjustChildrenDepth();
        return true;
    }
    removeChild(child) {
        if (this.left === child) this.left = undefined;
        else if (this.right === child) this.right = undefined;
        else return false;
        return true;
    }
    swapChild(child, swp) {
        if (this.left === child) this.left = swp;
        else if (this.right === child) this.right = swp;
        else return false;
        this.adjustChildrenDepth();
        return true;
    }

    adjustChildrenDepth() {
        if (this.left) {
            this.left.parent = this;
            this.left.depth = this.depth + 1;
            this.left.adjustChildrenDepth();
        }
        if (this.right) {
            this.right.parent = this;
            this.right.depth = this.depth + 1;
            this.right.adjustChildrenDepth();
        }
    }

    evaluate (X) {
        if (typeof this.val === 'function') {
            return this.val(this.left.evaluate(X), (typeof this.right !== 'undefined') && this.right.evaluate(X));
        }
        else if (typeof this.val === 'string') return X[this.val];
        return this.val;
    }

    deepChildren () {
        let c = [];
        if (this.left)
            c.push(...this.left.deepChildren());
        if (this.parent) c.push(this);
        if (this.right)
            c.push(...this.right.deepChildren());
        return c;
    }

    copy (parent = null) {
        let n = new Node(this.val);
        n.parent = parent;
        n.depth = this.depth;
        n.left = this.left && this.left.copy(n);
        n.right = this.right && this.right.copy(n);
        return n;
    }

    get subTreeDepth () {
        let l = this.left ? this.left.subTreeDepth : this.depth;
        let r = this.right ? this.right.subTreeDepth : this.depth;
        return l > r ? l : r;
    }

    truncate (maxDepth, terminalFn) {
        if (this.depth >= maxDepth) {
            this.val  = terminalFn();
            this.left = this.right = undefined;
        } else {
            if (this.left) this.left.truncate(maxDepth, terminalFn);
            if (this.right) this.right.truncate(maxDepth, terminalFn);
        }
    }
}

module.exports = Node;
