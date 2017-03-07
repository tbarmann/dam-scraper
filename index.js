var fs = require('fs');

var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});

var x = require('casper').selectXPath;

var links = [];

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

function scrapeTable(tableSelector) {
  var rows = [];
  var tableRows = document.querySelectorAll(tableSelector + ' tr');
  for (var i = 0; i<tableRows.length; i++) {
    var tableCols = tableRows[i].querySelectorAll('td, th');
    var cols = [];
    for (var j=0; j<tableCols.length; j++) {
      cols.push(tableCols[j].innerText.trim());
    }
    rows.push(cols);
  }
  return rows;
}

function arrayToCSV(arr) {
  var rows = [];
  arr.forEach(function(row) {
    rows.push(row.map(function(elem) { return '"' + elem.trim() + '"' }).join());
  });
  return rows.join('\n');
}

function writeToFile(filename, data) {
  fs.write("./" + filename, data, function(err) {
    if(err) {
        return (err);
    }
    return("The file was saved!");
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
  this.wait(1000, function() {
    this.evaluate(function() {
      document.querySelector('#apexir_COLUMN_NAME').value = 'STATE';
      document.querySelector('#apexir_STRING_OPT').value = '=';
      document.querySelector('#apexir_EXPR').value = 'RI';
    });
  });
});


casper.thenClick(x('//*[@id="apexir_btn_APPLY"]'));

casper.wait(3000, function() {
  this.evaluate(function() {
    gReport.search('SEARCH',10);
  });
});

casper.wait(3000, function() {
  this.capture('image.png');
});

var data = [];
casper.then(function() {
  data = this.evaluate(function() {
    var rows = [];
    var tableRows = document.querySelectorAll('table.apexir_WORKSHEET_DATA tr');
    for (var i = 0; i<tableRows.length; i++) {
      var tableCols = tableRows[i].querySelectorAll('td, th');
      var cols = [];
      for (var j=0; j<tableCols.length; j++) {
        cols.push(tableCols[j].innerText);
      }
      rows.push(cols);
    }
    console.log(rows);
    this.echo(JSON.stringify(rows));
    console.log(this);
    return rows;
  });
});

casper.run(function() {
  var csv = arrayToCSV(data);
//  console.log(csv);
  writeToFile('ri.csv', csv);
});

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
