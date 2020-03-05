# Inno-setup-with-self-update

POC application with self update app.

### Feature

- Bundle app with electron-packager.
- Build `.exe` file with inno-installer.
- Auto updated `latest.json` when build.
- When install and detect new version. auto check version from server, download, silent install.

### Prerequisite

Need to download [inno setup]("https://jrsoftware.org/isinfo.php") V6 and install in local.
then update file `build/build.js` to local file

```javascript
const compilerPath = path.join(
  "C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe" // change this to local path
);
```

### Setup

```
npm install
npm run build
```

### Step to update

1. Install application file from `/dist`.
2. Open application file. it will automate check for new update.
3. If have new version. it will silent install.
4. If curent version is latest. it will display message for inform user.

### Step to upgrade version and deploy

1. Upgrade version by `npm version <new version eg. 3.0.0>`.
2. Run command `npm run build`.
3. It will auto create new folder in `/dist` with `appname-x64-version` and update `latest.json`.
4. Upload `latest.json` and `appname-x64-version` to server.
5. Ff need new version. repeat step 1-4.
