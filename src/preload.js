"use strict";
window.dialog = require("electron").remote.dialog;
window.ipcRenderer = require("electron").ipcRenderer;
window.spawn = require("child_process").spawn;
window.BrowserWindow = require("electron").remote.BrowserWindow;
window.path = require("path");
window.__dirname = __dirname;
window.app = require("electron").remote.app;
window.request = require("request");
window.onload = () => {
  window.$ = require("jquery");
};

// message tags

///     Info message tag at line start
const RG_INFO = "^\\[INFO\\]";

///     Warning message tag at line start
const RG_WARN = "^\\[WARN(ING)?\\]";

///     Severe/Error message tag at line start
const RG_SEV = "^\\[(SEVERE|ERROR)\\]";

// ip's and player names

///     Ipv4 Ip address, without any extra's
const RG_IP_NOPORT = "\\d{1,3}.\\d{1,3}.\\d{1,3}.\\d{1,3}";

///     Ipv4 Ip address, with optional port. this is the typical ip for a minecraft login
const RG_IP = RG_IP_NOPORT + "(:\\d{2,5})?";

///     Ipv4 Ip with optional port, between right brackets
const RG_IP_BRACKET = "\\[/" + RG_IP + "\\]";

///     Player name
const RG_PLAYER = "\\w{2,16}";

// other regexes

///     Possible space or tab
const RG_SPACE = "(\\s{0,}|\\t{0,})";

///     At least one space
const RG_FSPACE = "\\s+";

///     Stacktrace, like "at net.minecraft.server ...
const RG_STACKTRACE =
  "(at |java\\.)(\\w+\\.){1,}(\\w|\\d|<){1,}(\\(|:|\\.|<|>)";

window.GLOBALREGEX = {
  RG_INFO,
  RG_WARN,
  RG_SEV,
  RG_IP_NOPORT,
  RG_IP,
  RG_IP_BRACKET,
  RG_PLAYER,
  RG_SPACE,
  RG_FSPACE,
  RG_STACKTRACE,
};
