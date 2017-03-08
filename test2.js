function extractLatLon(str) {
  var regex = /:\\([\d-.]+),([\d-.]+)/;
  if ((m = regex.exec(str)) !== null) {
    return {
      lat: parseFloat(m[1]),
      lon: parseFloat(m[2])
    }
  return {};
  }
}

console.log(extractLatLon("f?p=838:7:0:ZOOM_TO:NO::P7_MAP_EXTENT,P7_MAP_LAYERS:\\-85.12167,32.54,-85.12167,32.54\\,damnid"));



// const regex = /^(\d+)[\s-]+(\d+)[\sof]+(\d+)$/g;
// const str = `1 - 25 of 10000`;
// let m;

// while ((m = regex.exec(str)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === regex.lastIndex) {
//         regex.lastIndex++;
//     }

//     // The result can be accessed through the `m`-variable.
//     m.forEach((match, groupIndex) => {
//         console.log(`Found match, group ${groupIndex}: ${match}`);
//     });
// }

