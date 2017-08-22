// Electron lets you define a preload script on a webview. A preload script is a
// local JavaScript file that gets executed in the context of the remote web page
// before any other scripts on the remote web page. The preload script has access
// to Electron and node.js APIs, but when it has finished executing, those APIs
// are removed from the global scope so that the remote web page doesn’t have
// access to them. The preload script also has access to the DOM of the remote
// page.

// https://github.com/electron/electron/blob/master/docs/api/webview-tag.md#preload

const { ipcRenderer: ipc, remote } = require('electron');
const SerialPort = require('serialport');

function init() {
  // Don't inject anything if the current page isn't in our whitelist
  if (!isOriginWhitelisted(document.location.origin)) {
    return;
  }

  // Expose a bridging API to by setting globals on `window`.
  window.SerialPort = SerialPort;
  window.MakerBridge = {
    getVersion,
  };
}

function getVersion() {
  return '0.0.1';
}

function list(...args) {
  return SerialPort.list(...args);
}

function openSerialPort(portName, serialBaud) {
  return new SerialPort.SerialPort(portName, {
    autoOpen: true,
    bitrate: serialBaud,
  });
}

function isOriginWhitelisted(origin) {
  // Match origins:
  // https://studio.code.org                          Production
  // https://test-studio.code.org                     Test
  // https://dashboard-adhoc-my-branch.cdn-code.org   Ad-Hoc servers
  // http://localhost-studio.code.org:3000            Local development
  return /^https?:\/\/(?:[\w\d-]+\.)?(?:cdn-)?code\.org(?::\d+)?$/i.test(origin);
}

init();