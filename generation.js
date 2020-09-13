const Node = require('./node');
const { chooseRandomElement, random, funções, terminais } = require('./common');

function genRndExpr (func_set, term_set, max_d, method) {
    let expr;
    if (max_d === 0 || (method === 'grow' && random.double() < ((term_set.length)/(term_set.length + func_set.length)))) {
        expr = chooseRandomElement(term_set);
    } else {
        let args=[];
        let func = chooseRandomElement(func_set);
        for (let i=0; i<func.arity; i++) {
            args.push(genRndExpr(func_set, term_set, max_d - 1, method));
        }
        expr = [func, ...args];
    }
    return expr;
}

/**
 * 
 * @param {any} expr 
 * @param {Node} [tree] 
 */
function vecToTree (expr) {
    if (Array.isArray(expr)) {
        let tree = new Node(expr.shift());
        for (let e of expr) tree.addChild(vecToTree(e));
        return tree;
    }
    return new Node(expr)
}

function grow (maxDepth) {
    return vecToTree(genRndExpr(funções, terminais, maxDepth, 'grow'))
}

function full (maxDepth) {
    return vecToTree(genRndExpr(funções, terminais, maxDepth, 'full'))
}

function halfAndHalf (n, maxDepth) {
    let pop = [];
    let m = Math.floor(n/2);
    for (let i = 0; i < m; i++) {
        pop.push(grow(maxDepth));
    }
    for (let i = m; i < n; i++) {
        pop.push(full(maxDepth));
    }
    return pop;
}

module.exports = { halfAndHalf, grow, full }
