function mul (a,b) { return a * b; }
mul.toString = () => '*';
mul.arity = 2;

function sdiv (a,b) { return a / (b || Infinity); }
sdiv.toString = () => '/';
sdiv.arity = 2;

function minus (a,b) { return a - b; }
minus.toString = () => '-';
minus.arity = 2;

function plus (a,b) { return a + b; }
plus.toString = () => '+';
plus.arity = 2;

function tan (a) { return Math.tan(a); }
tan.toString = () => 't';
tan.arity = 1;

function sqrt (a) { return Math.sqrt(Math.abs(a)); }
sqrt.toString = () => '¬';
sqrt.arity = 1;

function quadrado (a) { return a*a; }
quadrado.toString = () => '^';
quadrado.arity = 1;

module.exports = { mul, sdiv, minus, plus, tan, sqrt, quadrado };