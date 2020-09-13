const Node = require('./node');
const { chooseRandomElement, random, funções, terminais } = require('./common');

/**
 * Gera um indivíduo na notação de vetor usada no livro
 * @param {import('./types').FunçãoPG[]} func_set 
 * @param {(number|string)[]} term_set 
 * @param {number} max_d 
 * @param {'grow'|'full'} method 
 */
function genRndExpr (func_set, term_set, max_d, method) {
    let expr;
    if (max_d === 0 || (method === 'grow' && random.double() < 0.5)) {
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
 * Transforma um indivíduo da notação de vetor em notação de árvore de fato
 * @param {any} expr 
 * @returns {Node}
 */
function vecToTree (expr) {
    if (Array.isArray(expr)) {
        let tree = new Node(expr.shift());
        for (let e of expr) tree.addChild(vecToTree(e));
        return tree;
    }
    return new Node(expr)
}

/**
 * Cresce um indivíduo de acordo com o método grow
 * @param {number} maxDepth profundidade máxima da árvore
 * @returns {Node}
 */
function grow (maxDepth) {
    return vecToTree(genRndExpr(funções, terminais, maxDepth, 'grow'))
}

/**
 * Cresce um indivíduo de acordo com o método full
 * @param {number} maxDepth profundidade máxima da árvore
 * @returns {Node}
 */
function full (maxDepth) {
    return vecToTree(genRndExpr(funções, terminais, maxDepth, 'full'))
}

/**
 * Gera uma população de tamanho `n` de acordo com o método ramped half and half
 * @param {number} n tamanho da população
 * @param {number} maxDepth profundidade máxima da árvore
 */
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
