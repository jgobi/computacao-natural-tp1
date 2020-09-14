const { halfAndHalf } = require('./generation');
const { crossover, mutação } = require('./operators');
const {
    chooseRandomElement,
    stringify,
    random,
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
} = require('./common');

/**
 * Calcula a fitness de uma população para um dataset
 * @param {import('./node')[]} população 
 * @param {number[][]} dataset 
 * @return {import('./types').Fitness[]}
 */
function fitness (população, dataset) {
    let y = dataset[0].length-1;
    return população.map(ind => {
        return [
            ind,
            dataset.reduce((acc, r) => {
                return acc + (ind.evaluate(r) - r[y])**2 // calcula erro
            }, 0),
        ]
    });
}

/**
 * Recebe um vetor de fitness e escolhe `k` posições aleatoriamente
 * (não considera a fitness, ela está aqui para simplificar o código)
 * @param {import('./types').Fitness[]} fit 
 * @param {number} k tamanho do torneio
 * @returns {import('./types').Fitness[]}
 */
function tournament (fit, k) {
    return sortFitness(Array(k).fill(fit).map(chooseRandomElement));
}

/**
 * Ordena os indivíduos por fitness
 * ATENÇÃO: esta função modifica o próprio array!!!!! (e também o retorna)
 * @param {import('./types').Fitness[]} fit 
 */
function sortFitness (fit) {
    return fit.sort((a, b) => a[1] - b[1])
}

(function programa (dataset) {
    console.error('Random seed: ', RANDOM_SEED);
    let osMelhores = [];
    let r = N_REPETIÇÕES;
    while (r--) { // r repetições
        let minhaPopulação = halfAndHalf(POPULAÇÃO, ALTURA_MÁXIMA); // população inicial
        let i = N_GERAÇÕES;

        while (i--) { // i gerações
            let fit = fitness(minhaPopulação, dataset);
            let novaPopulação = [];

            for (let i = 0; i < POPULAÇÃO - ELITISMO; i++) {
                let [ a ] = tournament(fit, K);

                let rand = random.double()
                if (rand < CHANCE_CROSSOVER) { // Se for crossover
                    let [ b ] = tournament(fit, K);
                    let [ filho ] = crossover(a[0], b[0]);
                    novaPopulação.push(filho);
                } else if (rand < CHANCE_CROSSOVER + CHANCE_MUTAÇÃO) {
                    novaPopulação.push(mutação(a[0]));
                } else {
                    // reprodução
                    novaPopulação.push(a[0]);
                }
            }

            if (ELITISMO) {
                sortFitness(fit);
                novaPopulação.push(...fit.slice(0, ELITISMO).map(x => x[0]));
            }
            minhaPopulação = novaPopulação;
        }

        let fit = fitness(minhaPopulação, dataset);
        sortFitness(fit);
        let caraMaisTop = fit[0];
        console.error(stringify(caraMaisTop));
        osMelhores.push(caraMaisTop);
    }

    console.error('======================');
    sortFitness(osMelhores);
    let caraMaisTopMesmo = osMelhores.shift();
    console.error(stringify(caraMaisTopMesmo));
    console.log(stringify(dataset.map(r => {
        let rr = [...r];
        rr.pop();
        rr.push(caraMaisTopMesmo[0].evaluate(r));
        return rr;
    })));
    
})(DATASET);
