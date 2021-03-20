var fs=require('fs');

//readFileSync
// console.log('A');
// var result = fs.readFileSync('Syntax/sample.txt', 'utf-8');
// console.log(result);
// console.log('C');

//output: A B C



//readFile
console.log('A');
fs.readFile('Syntax/sample.txt', 'utf-8', function(err, result) {
    console.log(result);
});
console.log('C');

//output: A C B