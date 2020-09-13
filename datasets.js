const fs = require('fs');

// function loadFile (file) {
//     return fs.readFileSync(__dirname+'/ds/'+file, 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number));
// }

// const circle = loadFile('SR_circle.txt');
// const ellipse_noise = loadFile('SR_ellipse_noise.txt');
// const div = loadFile('SR_div.txt');
// const div_noise = loadFile('SR_div_noise.txt');
// const concrete = loadFile('concrete.txt');


const circle =        fs.readFileSync(__dirname+'/ds/SR_circle.txt', 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number))
const ellipse_noise = fs.readFileSync(__dirname+'/ds/SR_ellipse_noise.txt', 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number))
const div =           fs.readFileSync(__dirname+'/ds/SR_div.txt', 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number))
const div_noise =     fs.readFileSync(__dirname+'/ds/SR_div_noise.txt', 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number))
const concrete =      fs.readFileSync(__dirname+'/ds/concrete.txt', 'utf8').trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number))

module.exports = {
    circle, ellipse_noise, div, div_noise, concrete,
}