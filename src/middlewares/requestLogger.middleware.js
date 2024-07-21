const fs = require('fs');
const path = require('path');
// const requestLoggerData = require('../Logs/requestLogger.json');
const { DATE_TIME } = require('../constants');


const requestLoggerFilePath = path.join(__dirname, '../Logs/requestLogger.json');
console.log("requestLoggerFilePath---->".requestLoggerFilePath);

// Function to format date as per the required format
const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} @ ${hours}:${minutes}:${seconds}`;
  };

/* Request details logger middleware */
const requestLoggerMiddleware = (req, res, next) => {
  // Read the file content or initialize if it doesn't exist or is empty
  let reqLogsData;
  try {
    // Attempt to read the file
    const fileData = fs.readFileSync(requestLoggerFilePath, { encoding: 'utf8' });
    reqLogsData = JSON.parse(fileData);
  } catch (error) {
    // If the file is empty or the data is malformed, initialize it
    reqLogsData = { requestLogs: [] };
  }

  let requestLoggerObj = {
    requestURL: req.url,
    requestMethod: req.method,
    requestTime: formatDate(new Date()),
  };

  // Push new request data into the log
  reqLogsData.requestLogs.push(requestLoggerObj);

  // Try to write the updated data back to the file
  try {
    // let finalReqLogs = JSON.stringify(reqLogsData, null, 2);
    let finalReqLogs = JSON.stringify(reqLogsData);

    fs.writeFileSync(requestLoggerFilePath, finalReqLogs, {
      encoding: 'utf8',
      flag: 'w'
    });
  } catch (error) {
    console.error(`Encountered error while writing log: ${error}`);
  }

  next();
};



// /* Request details logger middleware */
// const requestLoggerMiddleware = (req, res, next) => {
//   let requestLoggerObj = {
//     requestURL: req.url,
//     requestMethod: req.method,
//     requestTime: DATE_TIME,
//   };
//   let reqLogsData = JSON.parse(JSON.stringify(requestLoggerData));
//   reqLogsData.requestLogs.push(requestLoggerObj);
//   try {
//     let finalReqLogs = JSON.stringify(reqLogsData);
//     fs.writeFileSync('./src/Logs/requestLogger.json', finalReqLogs, {
//       encoding: 'utf8',
//       flag: 'w',
//     });
//   } catch (error) {
//     console.log(`Encountered error while writing log: ${error}`);
//   }
//   next();
// };

module.exports = requestLoggerMiddleware;