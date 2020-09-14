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
const plt = require('matplotnode');

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


// estatísticas
let melhorFitness = Array(N_GERAÇÕES + 1).fill(0).map(_ => Array(N_REPETIÇÕES).fill(0));
let piorFitness = Array(N_GERAÇÕES + 1).fill(0).map(_ => Array(N_REPETIÇÕES).fill(0));
let mediaFitness = Array(N_GERAÇÕES + 1).fill(0).map(_ => Array(N_REPETIÇÕES).fill(0));
let melhoresFilhos = Array(N_GERAÇÕES + 1).fill(0).map(_ => Array(N_REPETIÇÕES).fill(0));
let pioresFilhos = Array(N_GERAÇÕES + 1).fill(0).map(_ => Array(N_REPETIÇÕES).fill(0));
// fim estatísticas

(function programa (dataset) {
    console.error('Random seed: ', RANDOM_SEED);
    let osMelhores = [];
    for(let r = 0; r < N_REPETIÇÕES; r++) { // r repetições
        let minhaPopulação = halfAndHalf(POPULAÇÃO, ALTURA_MÁXIMA); // população inicial

        for (let i = 0; i < N_GERAÇÕES; i++) { // i gerações
            let fit = fitness(minhaPopulação, dataset);

            // ESTATÍSTICAS
            let minhaMelhorFitness = fit[0][1];
            let minhaPiorFitness = fit[0][1];
            let minhaMediaFitness = 0;
            for (let ind of fit) {
                if (ind[1] < minhaMelhorFitness) minhaMelhorFitness = ind[1];
                if (ind[1] > minhaPiorFitness) minhaPiorFitness = ind[1];
                minhaMediaFitness += ind[1];
            }
            melhorFitness[i][r] += minhaMelhorFitness;
            piorFitness[i][r] += minhaPiorFitness;
            mediaFitness[i][r] += minhaMediaFitness/POPULAÇÃO;
            // FIM ESTATÍSTICAS

            let novaPopulação = [];

            for (let j = 0; j < POPULAÇÃO - ELITISMO; j++) {
                let [ a ] = tournament(fit, K);

                let rand = random.double()
                if (rand < CHANCE_CROSSOVER) { // Se for crossover
                    let [ b ] = tournament(fit, K);
                    let [ filho ] = crossover(a[0], b[0]);
                    novaPopulação.push(filho);

                    // ESTATÍSTICAS
                    if (fitness([filho], dataset)[0][1] < (a[1] + b[1])/2) melhoresFilhos[i+1][r]++;
                    else pioresFilhos[i+1][r]++;
                    // FIM ESTATÍSTICAS

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

        // ESTATÍSTICAS
        melhorFitness[N_GERAÇÕES][r] += fit[0][1];
        piorFitness[N_GERAÇÕES][r] += fit[fit.length - 1][1];
        mediaFitness[N_GERAÇÕES][r] += fit.reduce((acc, ind)=>acc + ind[1], 0)/POPULAÇÃO;
        // FIM ESTATÍSTICAS
        
        let caraMaisTop = fit[0];
        console.error(stringify(caraMaisTop));
        osMelhores.push(caraMaisTop);
    }
    
    // ESTATÍSTICAS
    let melhorFitnessM = melhorFitness.map(x => (x.reduce((acc, y) => acc + y, 0))/N_REPETIÇÕES);
    let piorFitnessM = piorFitness.map(x => (x.reduce((acc, y) => acc + y, 0))/N_REPETIÇÕES);
    let mediaFitnessM = mediaFitness.map(x => (x.reduce((acc, y) => acc + y, 0))/N_REPETIÇÕES);
    let melhoresFilhosM = melhoresFilhos.map(x => (x.reduce((acc, y) => acc + y, 0))/N_REPETIÇÕES);
    let pioresFilhosM = pioresFilhos.map(x => (x.reduce((acc, y) => acc + y, 0))/N_REPETIÇÕES);

    let stdMelhorFitness = melhorFitness.map((x, i) => Math.sqrt(x.reduce((acc, y) => acc + (y - melhorFitnessM[i])**2, 0)/N_REPETIÇÕES)).reduce((acc, x) => acc + x, 0) / (N_GERAÇÕES + 1);
    let stdPiorFitness = piorFitness.map((x, i) => Math.sqrt(x.reduce((acc, y) => acc + (y - piorFitnessM[i])**2, 0)/N_REPETIÇÕES)).reduce((acc, x) => acc + x, 0) / (N_GERAÇÕES + 1);
    let stdMediaFitness = mediaFitness.map((x, i) => Math.sqrt(x.reduce((acc, y) => acc + (y - mediaFitnessM[i])**2, 0)/N_REPETIÇÕES)).reduce((acc, x) => acc + x, 0) / (N_GERAÇÕES + 1);
    let stdMelhoresFilhos = melhoresFilhos.map((x, i) => Math.sqrt(x.reduce((acc, y) => acc + (y - melhoresFilhosM[i])**2, 0)/N_REPETIÇÕES)).reduce((acc, x) => acc + x, 0) / N_GERAÇÕES;
    let stdPioresFilhos = pioresFilhos.map((x, i) => Math.sqrt(x.reduce((acc, y) => acc + (y - pioresFilhosM[i])**2, 0)/N_REPETIÇÕES)).slice(1).reduce((acc, x) => acc + x, 0) / N_GERAÇÕES;

    // FIM ESTATÍSTICAS


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


    console.error('$$$$$$$$$$$$$$$$$$$$$$')
    const x = Array(N_GERAÇÕES+1).fill(0).map((_,i)=>i);
    plt.title("Evolucao da melhor fitness")
    plt.plot(x, melhorFitnessM, `label=Melhor fitness (std=${stdMelhorFitness.toFixed(2)})`)
    plt.legend()
    plt.save("melhor_fitness.png")
    // plt.show()
    plt.title("Evolucao da pior fitness e da media")
    plt.plot(x, piorFitnessM, `label=Pior fitness (std=${stdPiorFitness.toFixed(2)})`)
    plt.plot(x, mediaFitnessM, `label=Fitness media (std=${stdMediaFitness.toFixed(2)})`)
    plt.legend()
    plt.save("pior_fitness.png")
    // plt.show()
    plt.title("Numero de filhos melhores ou piores que os pais no crossover")
    plt.plot(x.slice(1), melhoresFilhosM.slice(1), `label=Filhos melhores (std=${stdMelhoresFilhos.toFixed(2)})`)
    plt.plot(x.slice(1), pioresFilhosM.slice(1), `label=Filhos piores (std=${stdPioresFilhos.toFixed(2)})`)
    plt.legend()
    plt.save("filhos.png")
    // plt.show()

    // plt.title("Aproximacao do dataset SR_ellipse_noise")
    // plt.plot(dataset.map(x=>x[0]), dataset.map(x=>x[1]), 'label=Funcao real', 'marker=o', 'linestyle=None')
    // plt.plot(dataset.map(x=>x[0]), dataset.map(x => caraMaisTopMesmo[0].evaluate(x)), 'label=Funcao aproximada (err='+caraMaisTopMesmo[1].toFixed(2)+')', 'marker=o', 'linestyle=None')
    // plt.legend()
    // plt.save("ellipse_noise.png")
    // plt.show()
    
})(DATASET);
