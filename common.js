const alea = require('./alea');
const { mul, sdiv, minus, plus, tan, sqrt, quadrado } = require('./funcoes');

const RANDOM_SEED = 'leblebleb'

const K = 2;
const ELITISMO = true;
const POPULAÇÃO = 50;
const N_GERAÇÕES = 500;
const N_REPETIÇÕES = 30;
const ALTURA_MÁXIMA = 7;
const CHANCE_CROSSOVER = 0.9;

const N_VARIÁVEIS = 1;

const random = new alea(RANDOM_SEED);

const variáveis = Array(N_VARIÁVEIS).fill(0).map((_, i) => '' + i);
const funções = [mul, sdiv, minus, plus, tan, sqrt];
const terminais = [1, '0'];
Object.defineProperty(terminais, 0, {
    get () {
        return random.double()*2 - 1;
    }
});
Object.defineProperty(terminais, 1, {
    get () {
        return chooseRandomElement(variáveis);
    }
});

const funçõesETerminais = [1, '+'];
Object.defineProperty(funçõesETerminais, 0, {
    get () {
        return chooseRandomElement(terminais);
    }
});
Object.defineProperty(funçõesETerminais, 1, {
    get () {
        return chooseRandomElement(funções);
    }
});

function randomInt (n) {
    return Math.round(random.double()*(n-1))
}

function chooseRandomElement (set) {
    return set[randomInt(set.length)];
}

const stringify = o => JSON.stringify(o, (key, value) => (key === 'parent') ? undefined : (typeof value ==='function' ? value+'' : value), 4);

module.exports = {
    CHANCE_CROSSOVER,
    ALTURA_MÁXIMA,
    N_REPETIÇÕES,
    RANDOM_SEED,
    N_GERAÇÕES,
    POPULAÇÃO,
    ELITISMO,
    K,

    chooseRandomElement,
    funçõesETerminais,
    terminais,
    stringify,
    funções,
    random,
}