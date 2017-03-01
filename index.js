var casper = require('casper').create();
var x = require('casper').selectXPath;

var links = [];

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start('http://nid.usace.army.mil/', function() {
  // Wait for the page to be loaded
  this.waitForSelector('#wwvFlowForm');
  this.fill('#wwvFlowForm',
    {'p_t01': '13'}
  );
  this.waitForSelector('div#tabs');
});

casper.thenClick(x('//*[@id="tabs"]/div/div/div/div[4]/div/a'));

casper.thenClick(x('//*[@id="apexir_ACTIONSMENUROOT"]'));

casper.thenClick(x('//*[@id="apexir_ACTIONSMENU"]/li[3]/a'), function() {
  this.wait(3000, function() {
    this.evaluate(function(sel) {
      document.querySelector(sel).value = 'STATE';
    }, '#apexir_COLUMN_NAME');
    this.evaluate(function(sel) {
      document.querySelector(sel).value = '=';
    }, '#apexir_STRING_OPT');
    this.evaluate(function(sel) {
      document.querySelector(sel).value = 'RI';
    }, '#apexir_EXPR');
    this.evaluate(function() {
      gReport.search('SEARCH',1000);
    });
  });
});

casper.thenClick(x('//*[@id="apexir_btn_APPLY"]'));

casper.wait(3000, function() {
    this.capture('image.png');
});





casper.run();

// casper.then(function() {
//    // search for 'casperjs' from google form
//    this.fill('form[action="/search"]', { q: 'casperjs' }, true);
// });




// casper.then(function() {
//     // aggregate results for the 'casperjs' search
//     links = this.evaluate(getLinks);
//     // now search for 'phantomjs' by filling the form again
//     this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
// });

// casper.then(function() {
//     // aggregate results for the 'phantomjs' search
//     links = links.concat(this.evaluate(getLinks));
// });

// casper.run(function() {
//     // echo results in some pretty fashion
//     this.echo(links.length + ' links found:');
//     this.echo(' - ' + links.join('\n - ')).exit();
// });
