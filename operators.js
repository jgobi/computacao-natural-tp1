const { chooseRandomElement, funçõesETerminais, terminais, ALTURA_MÁXIMA } = require('./common');
const { grow } = require('./generation');


/**
 * Realiza um crossover num ponto aleatório dos dois indivíduos, truncando caso necessário.
 * Retorna os dois novos indivíduos criados
 * @param {import('./node')} node1 
 * @param {import('./node')} node2 
 */
function crossover (node1, node2) {
    let a = node1.copy();
    let b = node2.copy();
    let na = a.deepChildren();
    let nb = b.deepChildren();

    let filhoA = chooseRandomElement(na);
    let filhoB = chooseRandomElement(nb);
    if (!filhoA || !filhoB) {
        return [a, b]; // isso nunca deve acontecer, mas só para caso aconteça, estamos resguardados
    }
    let parentA = filhoA.parent;
    let parentB = filhoB.parent;

    parentA.swapChild(filhoA, filhoB);
    parentB.swapChild(filhoB, filhoA);
    
    a.truncate(ALTURA_MÁXIMA, () => chooseRandomElement(terminais))
    b.truncate(ALTURA_MÁXIMA, () => chooseRandomElement(terminais))
    return [a, b];
}

/**
 * Muta um indivíduo num ponto arbitrário, destruindo ramificações ou crescendo por grow caso necessário
 * Retorna o novo indivíduo
 * @param {import('./node')} node tree
 */
function mutação (node) {
    let a = node.copy();
    let nodes = [a, ...a.deepChildren()]; // inclui o próprio nó na lista dos que podem sofrer mutação
    let filho = chooseRandomElement(nodes);
    let oldVal = filho.val;

    if (filho.depth >= ALTURA_MÁXIMA) { // se está mudando um nó que já esteja na altura máxima
        filho.val = chooseRandomElement(terminais); // ele deve virar um terminal.
        filho.left = filho.right = undefined;
    } else {
        filho.val = chooseRandomElement(funçõesETerminais);
        // se agora o nó é uma função, produz ou destrua filhos dele até a aridade correta da função
        if (typeof filho.val === 'function') {
            let remainingArity = filho.val.arity - (typeof oldVal === 'function' ? oldVal.arity : 0);
            if (remainingArity < 0) {
                filho.removeChild(filho.right);
            } else if (remainingArity > 0) {
                while (remainingArity--) {
                    // cresça filhos respeitando a altura máxima da árvore
                    let d = ALTURA_MÁXIMA - filho.depth - 1;
                    filho.addChild(grow(d));
                }
            }
        } else { // se o nó agora é um terminal, remove os seus filhos
            filho.left = filho.right = undefined;
        }
    }
    return a;
}

module.exports = { crossover, mutação };