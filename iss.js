// REQUIRE

const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // console.log(response)
    // console.log(body)
    // let fetchedIP = body.fetchedIP
    // console.log(fetchedIP)
    
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }
    
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`));
      return;
    }

    // if we get here, all's well and we got the data; proceed with the following
    const fetchedIP = JSON.parse(body).ip;
    callback(null, fetchedIP);
  });
};

// fetchMyIP(); // This is now being called by index.js

// FETCHCOORDSBYIP FUNCTION

const fetchCoordsByIP = function(ip, callback) {

  request('https://freegeoip.app/json/172.83.40.49', (error, response, body) => {

    // console.log(JSON.parse(body))
    // console.log(response.statusCode)

    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      // My guess at coding this
      //   return callback(error, null)
      // } else {
      //   return callback(response.statusCode)
      // }
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    // if we get here, all's well and we got the data
    
    // How I got the coords:
    // const fetchedCoords = `latitude: ${JSON.parse(body).latitude}, longitude: ${JSON.parse(body).longitude}`
    // console.log(fetchedCoords)
    
    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });

    // console.log({ latitude, longitude })

  });

};

// fetchCoordsByIP()

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
// module.exports = { fetchMyIP, fetchCoordsByIP }; // No longer necessary
// module.exports = { fetchISSFlyOverTimes }; // Only necessary for testing