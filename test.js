var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});


function scrapeTable(tableSelector) {
  this.echo(tableSelector);
}

casper.start('http://mojotech.com/');

casper.then(function() {
    casper.capture('image.png');
})


//casper.evaluate(scrapeTable);

casper.then(function(){
  this.evaluate(function myFunc() {
    this.echo('hello');
    console.log('goodbye');
  });
});

casper.run();






