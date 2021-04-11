// REQUIRE
const { nextISSTimesForMyLocation } = require('./iss');
// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss'); // No longer necessary after succesful test of fetchISSFlyOverTimes

// FETCHMYIP FUNCTION

// fetchMyIP((error, ip) => {
  
//   if (error) {
//     console.log("It didn't work!" , error);
//     // return;
//   }

//   console.log('It worked! Returned IP:' , ip);
  
// });

// FETCHCOORDSBYIP FUNCTION

// fetchCoordsByIP( '172.83.40.49', (error, coordinates) => {

//   if (error) {
//     console.log("An error happened:", error)
//   }

//   console.log("Here's your coordinate data", coordinates)

// });

/* EXAMPLECOORDS FUNCTION // TEMPORARY TO TEST FUNCTION IN iss.js

const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };

fetchISSFlyOverTimes(exampleCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned flyover times:' , passTimes);
});

*/

/**
 * Input:
 *   Array of data objects defining the next fly-overs of the ISS.
 *   [ { risetime: <number>, duration: <number> }, ... ]
 * Returns:
 *   undefined
 * Sideffect:
 *   Console log messages to make that data more human readable.
 *   Example output:
 *   Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
 */
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

// NEXTISSTTIMESFORMYLOCATION FUNCTION

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});