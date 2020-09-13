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
 * 
 * @param {any[]} populacao 
 * @param {number[][]} dataset 
 * @return {any[]}
 */
function fitness (populacao, dataset) {
    let y = dataset[0].length-1;
    return populacao.map(ind => {
        return [
            ind,
            dataset.reduce((acc, r) => {
                return acc + (ind.evaluate(r) - r[y])**2
            }, 0),
        ]
    });
}

function tournament (fit, k) {
    return Array(k).fill(fit).map(chooseRandomElement);
}

function sortFitness (fit) {
    return fit.sort((a, b) => a[1] - b[1])
}

/**
 * 
 * @param {*} populacao 
 * @param {*} dataset 
 * @returns {any[][]}
 */
function getBest (populacao, dataset) {
    return sortFitness(fitness(populacao, dataset));
}

(function programa (dataset) {
    console.error('Random seed: ', RANDOM_SEED);
    let osMelhores = [];
    let r = N_REPETIÇÕES;
    while (r--) {
        let mypop = halfAndHalf(POPULAÇÃO, ALTURA_MÁXIMA);
        let i = N_GERAÇÕES;
        while (i--) {
            let fit = fitness(mypop, dataset);
            let tmp = [];
            for (let i = 0; i < (POPULAÇÃO/2) - +ELITISMO; i++) {

                let a = tournament(fit, K)[0][0];
                let b = tournament(fit, K)[0][0];
                let r = random.double();
                if (r < CHANCE_CROSSOVER) {
                    tmp.push(a,b);
                    tmp.push(...crossover(a, b));
                } else {
                    let rr = random.double();
                    if (rr < 1/3) {
                        tmp.push(mutação(a));
                        tmp.push(b)
                    }
                    else if (rr < 2/3) {
                        tmp.push(a)
                        tmp.push(mutação(b));
                    }
                    else {
                        tmp.push(mutação(a));
                        tmp.push(mutação(b));
                    }
                }
            }
            if (ELITISMO) {
                sortFitness(fit);
                tmp.push(fit[0][0].copy(), fit[1][0].copy());
            }
            mypop = tmp;
        }

        let caraMaisTop = getBest(mypop, dataset).shift();
        console.error(stringify(caraMaisTop));
        osMelhores.push(caraMaisTop)
    }
    console.error('======================')
    sortFitness(osMelhores);
    let besties =getBest(osMelhores.map(i=>i[0]), dataset);
    let caraMaisTopMesmo = besties.shift();
    console.error(stringify(caraMaisTopMesmo), besties.pop()[1]);
    console.log(stringify(dataset.map(r => {
        let rr = [...r];
        rr.pop();
        rr.push(caraMaisTopMesmo[0].evaluate(r));
        return rr;
    })));
    
})(datasets.div);
