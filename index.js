const { halfAndHalf } = require('./generation');
const datasets = require('./datasets');
const { crossover, mutação } = require('./operators');
const {
    chooseRandomElement,
    stringify,
    random,
    CHANCE_CROSSOVER,
    ALTURA_MÁXIMA,
    N_REPETIÇÕES,
    RANDOM_SEED,
    N_GERAÇÕES,
    POPULAÇÃO,
    ELITISMO,
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
    return Array(k).fill(fit).map(chooseRandomElement);
}

/**
 * Ordena os indivíduos por fitness
 * ATENÇÃO: esta função modifica o próprio array!!!!! (e também o retorna)
 * @param {import('./types').Fitness[]} fit 
 */
function sortFitness (fit) {
    return fit.sort((a, b) => a[1] - b[1])
}

/**
 * Calcula e ordena a fitness para uma população em um dataset
 * @param {import('./node')[]} população 
 * @param {number[][]} dataset 
 */
function getBest (população, dataset) {
    return sortFitness(fitness(população, dataset));
}

/**
 * Escolhe 2 indivíduos por torneio
 * @param {import('./types').Fitness[]} fit 
 * @param {number} k 
 */
function escolheDoisPorTorneio (fit, k) {
    return [tournament(fit, k)[0][0], tournament(fit, k)[0][0]];
}



const CHANCE_MUTAÇÃO = 0.05;
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

            for (let i = 0; i < (POPULAÇÃO/2) - +ELITISMO; i++) {
                // cada iteração coloca 2 na população, então repito até:
                //   - se tiver elitismo: população/2 - 1
                //   - se não tiver elitismo: população/2
                let [a, b] = escolheDoisPorTorneio(fit, K);

                let rand = random.double()
                if (rand < CHANCE_CROSSOVER) { // Se for crossover
                    novaPopulação.push(...crossover(a, b));
                } else if (rand < CHANCE_CROSSOVER + CHANCE_MUTAÇÃO) {
                    // Como tenho que adicionar 2 elementos, verifico se tenho que fazer mutação
                    // só em um ou nos dois
                    let rr = random.double();
                    if (rr < 1/3) {
                        novaPopulação.push(mutação(a), b);
                    }
                    else if (rr < 2/3) {
                        novaPopulação.push(a, mutação(b));
                    }
                    else {
                        novaPopulação.push(mutação(a), mutação(b));
                    }
                } else {
                    // reprodução
                    novaPopulação.push(a, b);
                }
            }
            // se tiver elitismo, coloca os 2 melhores na população.
            if (ELITISMO) {
                sortFitness(fit);
                novaPopulação.push(fit[0][0].copy(), fit[1][0].copy());
            }
            minhaPopulação = novaPopulação;
        }

        let caraMaisTop = getBest(minhaPopulação, dataset).shift();
        console.error(stringify(caraMaisTop));
        osMelhores.push(caraMaisTop)
    }
    console.error('======================')
    sortFitness(osMelhores);
    let besties = getBest(osMelhores.map(i=>i[0]), dataset);
    let caraMaisTopMesmo = besties.shift();
    console.error(stringify(caraMaisTopMesmo), besties.pop()[1]);
    console.log(stringify(dataset.map(r => {
        let rr = [...r];
        rr.pop();
        rr.push(caraMaisTopMesmo[0].evaluate(r));
        return rr;
    })));
    
})(datasets.div_noise);
