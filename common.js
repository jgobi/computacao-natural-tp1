const path = require('path');
const fs = require('fs');
const alea = require('./alea');
const { mul, sdiv, minus, plus, tan, sqrt, quadrado } = require('./functions');

function loadDataset (file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number));
}

// =========== [INÍCIO] DATASET

const DATASET = process.argv[2] ? loadDataset(process.argv[2]) : require('./datasets').div;
const N_VARIÁVEIS = DATASET[0].length - 1;

// =========== [FIM] DATASET
// =========== [INÍCIO] CONSTANTES

const RANDOM_SEED = 'leblebleb'

const K = 2;
const ELITISMO = 2;
const POPULAÇÃO = 50;
const N_GERAÇÕES = 100;
const N_REPETIÇÕES = 30;
const ALTURA_MÁXIMA = 7;
const CHANCE_MUTAÇÃO = 0.05;
const CHANCE_CROSSOVER = 0.9;

// =========== [FIM] CONSTANTES

/**
 * @type {{double: () => number}}
 */
const random = new alea(RANDOM_SEED); // prng

const funções = [mul, sdiv, minus, plus, tan, sqrt]; // vetor de funções para geração de indivíduos

const variáveis = Array(N_VARIÁVEIS).fill(0).map((_, i) => '' + i);
const terminais = [1, '0']; // boilerplate do vetor de terminais para geração de indivíduos

 // define que a primeira posição do vetor de terminais é um getter para uma constante aleatória
Object.defineProperty(terminais, 0, {
    get () {
        return random.double()*2 - 1;
    }
});
// define que a segunda posição do vetor de terminais é um getter para uma variável aleatória
Object.defineProperty(terminais, 1, {
    get () {
        return chooseRandomElement(variáveis);
    }
});

const funçõesETerminais = [1, '+'];
// define que a primeira posição do vetor de funções e terminais é um getter para um terminal aleatório
Object.defineProperty(funçõesETerminais, 0, {
    get () {
        return chooseRandomElement(terminais);
    }
});
// define que a segunda posição do vetor de terminais é um getter para uma função aleatória
Object.defineProperty(funçõesETerminais, 1, {
    get () {
        return chooseRandomElement(funções);
    }
});

/**
 * 
 * @param {number} n 
 * @returns {number}
 */
function randomInt (n) {
    return Math.round(random.double()*(n-1))
}

/**
 * @template T
 * @param {T[]} set 
 * @returns {T}
 */
function chooseRandomElement (set) {
    return set[randomInt(set.length)];
}

/**
 * Retorna uma representação em string de um indivíduo
 * @param {any} o 
 */
const stringify = o => JSON.stringify(o, (key, value) => (key === 'parent') ? undefined : (typeof value ==='function' ? value+'' : value), 4);

module.exports = {
    CHANCE_CROSSOVER,
    CHANCE_MUTAÇÃO,
    ALTURA_MÁXIMA,
    N_REPETIÇÕES,
    RANDOM_SEED,
    N_GERAÇÕES,
    POPULAÇÃO,
    ELITISMO,
    DATASET,
    K,

    chooseRandomElement,
    funçõesETerminais,
    terminais,
    stringify,
    funções,
    random,
}