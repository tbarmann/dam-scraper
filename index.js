var fs = require('fs');
var recordCount;
var data = [];
var links = [];

var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});

var x = require('casper').selectXPath;

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}
function scrapeTable(selector) {
  var innerFunc = function () {

    function extractLatLon(str) {
      var regex = /:\\([\d-.]+),([\d-.]+)/;
      if ((m = regex.exec(str)) !== null) {
        return {
          lat: (m[1]).toString(),
          lon: (m[2]).toString()
        };
      }
      return {
        lat: "none",
        lon: "none"
      };
    }

    function hasLink(node) {
      var href = node.querySelector('a');
      return (href !== null && href.getAttribute('href') !== "#");
    }

    function getHref(node) {
      return node.querySelector('a').getAttribute('href');
    }

    var rows = [];
    var tableRows = document.querySelectorAll(__replaceme__ + ' tr');
    for (var i = 0; i<tableRows.length; i++) {
      var tableCols = tableRows[i].querySelectorAll('td, th');
      var cols = [];
      for (var j=0; j<tableCols.length; j++) {
        var cell = tableCols[j];
        if (hasLink(cell)) {
          var href = getHref(cell);
          var coords = extractLatLon(href);
          cols.push(coords.lat,coords.lon);
        }
        else {
          cols.push(cell.innerText);
        }
      }
      rows.push(cols);
    }
    return rows;
  };
  return innerFunc.toString().replace('__replaceme__', JSON.stringify(selector));
}

function arrayToCSV(arr) {
  console.log(JSON.stringify(arr));
  var rows = [];
  arr.forEach(function(row) {
    rows.push(row.map(function(elem) {
      if (elem === undefined) {
        console.log("elem undefined");
      }

     return JSON.stringify(elem.trim()) }).join());
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

function extractRecordCount(str) {
  // 1 - 25 of 10000
  var regex = /^(\d+)[\s-]+(\d+)[\sof]+(\d+)$/;
  var matches = str.trim().match(regex);
  if (matches.length > 3) {
    return {
      start: parseInt(matches[1]),
      end: parseInt(matches[2]),
      total: parseInt(matches[3])
    }
  }
  return {};
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
  recordCount = this.evaluate(function() {
    gReport.search('SEARCH',1000);
    return document.querySelectorAll('span.fielddata')[2].innerText;
  });
});

casper.wait(5000, function() {
  data = this.evaluate(scrapeTable("table.apexir_WORKSHEET_DATA"));
  this.capture('image.png');
});

casper.then(function() {
  var csv = arrayToCSV(data);
  writeToFile('ri.csv', csv);
});

casper.run(function() {
});

