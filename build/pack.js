const packager = require("electron-packager");

async function bundleElectronApp(options) {
  const appPaths = await packager(options);
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
}
const options = {
  out: "./pack",
  dir: ".",
  platform: "win32",
  arch: "x64",
  overwrite: true
  // win32metadata: {
  //   "requested-execution-level": "requireAdministrator"
  // }
};
bundleElectronApp(options);
