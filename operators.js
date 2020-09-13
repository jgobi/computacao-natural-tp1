const { chooseRandomElement, funçõesETerminais, terminais, ALTURA_MÁXIMA } = require('./common');
const { grow } = require('./generation');


/**
 * 
 * @param {Node} node1 
 * @param {Node} node2 
 */
function crossover (node1, node2) {
    let a = node1.copy();
    let b = node2.copy();
    let na = a.deepChildren();
    let nb = b.deepChildren();

    let filhoA = chooseRandomElement(na);
    let filhoB = chooseRandomElement(nb);
    if (!filhoA || !filhoB) return [a, b];
    let parentA = filhoA.parent;
    let parentB = filhoB.parent;

    parentA.swapChild(filhoA, filhoB);
    parentB.swapChild(filhoB, filhoA);
    
    a.truncate(ALTURA_MÁXIMA, () => chooseRandomElement(terminais))
    b.truncate(ALTURA_MÁXIMA, () => chooseRandomElement(terminais))
    return [a, b];
}

/**
 * 
 * @param {Node} node tree
 */
function mutação (node) {
    let a = node.copy();
    let nodes = [a, ...a.deepChildren()];
    let filho = chooseRandomElement(nodes);
    let oldVal = filho.val;

    if (filho.depth >= ALTURA_MÁXIMA) {
        filho.val = chooseRandomElement(terminais);
        filho.left = filho.right = undefined;
    } else {
        filho.val = chooseRandomElement(funçõesETerminais);
        if (typeof filho.val === 'function') {
            let remainingArity = filho.val.arity - (typeof oldVal === 'function' ? oldVal.arity : 0);
            if (remainingArity < 0) {
                filho.removeChild(filho.right);
            } else if (remainingArity > 0) {
                while (remainingArity--) {
                    let d = ALTURA_MÁXIMA - filho.depth - 1;
                    filho.addChild(grow(d));
                }
            }
        } else {
            if (filho.left) filho.removeChild(filho.left);
            if (filho.right) filho.removeChild(filho.right);
        }
    }
    return a;
}

module.exports = { crossover, mutação };