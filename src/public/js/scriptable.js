const $ = window.$;
const state = {
  process: null,
  serverJAR: null,
  folder: null,
  isOn: false,
  players: [],
};
// Hook up Event Handlers
// Power Options
document.getElementById("settings").addEventListener("click", clickSettings);
document.getElementById("powerOff").addEventListener("click", power);
//
function power() {
  if (!state.serverJAR) return alert("Change settings [no jar found]");
  if (!state.folder)
    return alert("Change settings [no working directory found]");
  if (state.isOn === true) {
    alert("Stopping server.");
    state.isOn = false;
    return state.process.kill("SIGINT");
  }
  runServerInstance();
}

function runServerInstance() {
  alert("Starting Server.");
  state.process = window.spawn(
    `java`,
    ["-Xmx6G", "-Xms4G", "-jar", state.serverJAR],
    {
      cwd: `${state.folder}`,
    }
  );
  state.isOn = true;
  const proc = state.process;
  console.log(proc);
  proc.stdout.on("data", function (data) {
    // console.log(data.toString());
    textParser(data);
    window.$(function () {
      //  $("#messages").append(data.toString());

      window.$("#output").scrollTop(window.$("#output")[0].scrollHeight);
    });
    //  console.log("stdout: " + data.toString());
  });

  proc.on("exit", function (code) {
    document.getElementById("run").disabled = false;
    document.getElementById("kill").disabled = true;
    console.log("child process exited with code " + code.toString());
  });
}
function clickSettings(e) {
  let win = new window.BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: window.path.join(window.app.getAppPath(), "/src/preload.js"),
    },
  });
  win.loadFile(window.path.join(window.__dirname, "/pages/settings.html"));
  win.show();
}
window.ipcRenderer.on("serverJar", (event, args) => {
  event.returnValue = "Main said I received your Sync message";
  window
    .$("#messages")
    .append(
      window
        .$('<li style="white-space: pre; background-color: #d8d216">')
        .text(`[APP] Changed JAR to ${args}`)
    );
  state.serverJAR = args;
});
window.ipcRenderer.on("serverDir", (event, args) => {
  event.returnValue = "Main said I received your Sync message";
  window
    .$("#messages")
    .append(
      window
        .$('<li style="white-space: pre; background-color: #d8d216">')
        .text(`[APP] Changed Directory to ${args}`)
    );
  state.folder = args;
});
let tempQueue = null;
function textParser(chunk) {
  // chunks are in ascii decimals
  // 10 is line feed
  if (chunk[chunk.length - 1] != 10) {
    // in here it means that the chunk was not finished, we can put it into a queue and wait.
    if (tempQueue != null) {
      // in here this means that there was a previous value in there.
      tempQueue = tempQueue.concat(chunk);
      // now we check if its the end of a chunk
      if (tempQueue[tempQueue.length - 1] != 10) {
        return;
      } else {
        parseText(tempQueue);
        return (tempQueue = null); // reset this.
      }
    } else {
      return (tempQueue = chunk);
    }
  } else {
    parseText(chunk.toString());
  }
}
/**
 *
 * @param {*} text
 * @returns can return type: general, severe, info, warning, disconnect, left, disconnect, playerList
 */
function parseText(text) {
  const regex = /^\[\d{1,2}:\d{1,2}:\d{1,2}\] \[Server thread\/INFO\]:(\s{0,}|\t{0,})(\w{2,16})\[\/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}(:\d{2,5})?\] logged in with entity id/gm;
  if (text.match(regex)) {
    const player = regex.exec(text)[2];
    console.log(`Player ${player} joined.`);
    eventPlayerJoin(player);
  }
  window
    .$("#messages")
    .append(window.$('<li style="white-space: pre">').text(text));
}
function eventPlayerJoin(name) {
  window.request(
    `https://playerdb.co/api/player/minecraft/${name}`,
    (e, r, b) => {
      const response = JSON.parse(b);
      if (response.success === false) {
        window.$(".playerGrid").append(`
        <div class="player noselect selectable" id='${name}' onclick="playerClicked('${name}')">
            <span style="display: hidden;">
              <img
                src="https://crafatar.com/avatars/069a79f4-44e9-4726-a5be-fca90e38aaf5?size=44"
                class="list-avatar"
              />
              <span class="name" style="float: inherit;"></h2>
                AndyIsCool5453
              </span>
            </span>
          </div>
        `);
      } else {
        window.$(".playerGrid").append(`
        <div class="player noselect selectable" id='${b.player.id}' onclick="playerClicked('${name}')">
            <span style="display: hidden;">
              <img
                src="${b.player.avatar}?size=44"
                class="list-avatar"
              />
              <span class="name" style="float: inherit;"></h2>
                AndyIsCool5453
              </span>
            </span>
          </div>
        `);
      }
    }
  );
}

function playerClicked(playerName) {
  // window.$(".actionList").filter(function () {
  //   if (window.$(this).css("display") == "none") {
  //     // this means the actions r open;
  //   }
  // });

  // i completely forgot why i wrote the code above tbh
  window.$(".actionList").toggle();
}
