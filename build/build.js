const cp = require("child_process");
const path = require("path");
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
  "./dist/latest.json",
  JSON.stringify(jsonData),
  { flag: "w" },
  err => {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  }
);

const compilerPath = path.join(
  "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe"
);
const execute = cp.spawn(compilerPath, [
  "./build/setup.iss",
  `/dMyAppName=${packageData.name}`,
  `/dMyExe=${packageData.name}-x64-${packageData.version}`,
  `/dMyAppVersion=${packageData.version}`,
  `/dMyAppExeName=${packageData.name}.exe`
]);
execute.stdout.on("data", data => {
  console.log(`stdout: ${data}`);
});
execute.on("error", error => {
  console.log(`error: ${error}`);
});
execute.on("close", code => {
  console.log(`child process exited with code ${code}`);
});
