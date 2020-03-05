const os = require("os");
const jsonLatestVersionApp = require("./dist/latest.json");
const { dialog } = require("electron");
const axios = require("axios");
const pfs = require("pfs");
const cp = require("child_process");
const path = require("path");

const setupFeedURL = async url => {
  // http://206.189.37.133/self-update/latest.json
  return await axios
    .get(`${url}/latest.json`)
    .then(result => result.data)
    .catch(error => error.message);
};

function compareIsNewDate(oldVer, newVer) {
  oldVer = new Date(oldVer);
  newVer = new Date(newVer);
  if (newVer - oldVer > 0) {
    return true;
  }
  return false;
}

function compareIsNewerVersion(oldVer, newVer) {
  const oldParts = oldVer.split(".");
  const newParts = newVer.split(".");
  for (var i = 0; i < newParts.length; i++) {
    const a = parseInt(newParts[i]) || 0;
    const b = parseInt(oldParts[i]) || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

function getTempPath(appName) {
  return new Promise((resolve, reject) => {
    pfs.mkdtemp(path.join(os.tmpdir(), appName), (err, folder) => {
      if (err) reject(null);
      console.log("folder temp: ", folder);
      resolve(folder);
    });
  });
}
async function doDownloadFileFromServer(fullAppName, downloadLink, tempPath) {
  return new Promise(async (resolve, reject) => {
    await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream"
    })
      .then(result => {
        const fullPath = `${tempPath}/${fullAppName}.exe`;
        const readStream = pfs.createWriteStream(fullPath);
        result.data.pipe(readStream);
        result.data.on("close", () => {
          resolve(fullPath);
        });
      })
      .catch(error => reject(null));
  });
}
function generateFullAppName(jsonServer) {
  const { appName, version } = jsonServer;
  return `${appName}-x64-${version}`;
}

function isNewVersionAvalible(jsonApp, jsonServer) {
  if (
    compareIsNewerVersion(jsonApp.version, jsonServer.version) &&
    compareIsNewDate(jsonApp.releaseDate, jsonServer.releaseDate)
  ) {
    return true;
  }
  return false;
}

function doInstall(downloadedFile) {
  const execute = cp.spawn(downloadedFile, [
    "/verysilent",
    "/nocloseapplications"
  ]);
  return new Promise((resolve, reject) => {
    execute.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });
    execute.on("error", error => {
      reject(null);
    });
    execute.on("close", code => {
      const message = `child process exited with code ${code}`;
      resolve(message);
      console.log(message);
    });
  });
}

function doUpdateJsonFile(jsonServer) {
  pfs.unlinkSync("./dist/latest.json");
  pfs.writeFile(
    "./dist/latest.json",
    JSON.stringify(jsonServer),
    { flag: "wx" },
    err => {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );
}

async function doCheckUpdate() {
  const appUrl = "http://206.189.37.133/inno-setup-with-self-update";
  const jsonLatestVersionServer = await setupFeedURL(appUrl);
  const isNewVersion = isNewVersionAvalible(
    jsonLatestVersionApp,
    jsonLatestVersionServer
  );
  if (isNewVersion) {
    const fullAppName = generateFullAppName(jsonLatestVersionServer);
    const downloadLink = `${appUrl}/${fullAppName}/${fullAppName}.exe`;
    const tempPath = await getTempPath(fullAppName);
    const downloadedFile = await doDownloadFileFromServer(
      fullAppName,
      downloadLink,
      tempPath
    );
    // const downloadedFile = path.join(__dirname, "/temp/test-app-x64-1.0.1.exe");
    if (downloadedFile) {
      const isInstalled = await doInstall(downloadedFile);
      if (isInstalled) doUpdateJsonFile(jsonLatestVersionServer);
    }
  } else {
    const message = `this version ${jsonLatestVersionApp.version} is latest version`;
    dialog.showMessageBox({
      type: "info",
      title: "This is latest version",
      message
    });
    console.log(message);
  }
}

module.exports = { doCheckUpdate };
