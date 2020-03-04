const pfs = require("pfs");
const packageData = require("../package.json");

function prepareJson(packageData) {
  return {
    appName: packageData.name,
    version: packageData.version,
    releaseDate: new Date().toISOString()
  };
}

const jsonData = prepareJson(packageData);

pfs.writeFile(
  "./latest.json",
  JSON.stringify(jsonData),
  { flag: "wx" },
  err => {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  }
);
