//console.log(arguments);
//console.log(require("module").wrapper);

const calculator = require("./test-module-1");
const calc = new calculator();
console.log(calc.sum(5, 6));

const { sum, sub, mul } = require("./test-module-2");
console.log(mul(9, 6));

//caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
