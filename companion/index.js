import { settingsStorage } from "settings";
import { me } from "companion";
import * as messaging from "messaging";

// Event fires when a setting is changed
settingsStorage.onchange = function (evt) {
  sendValue(evt.key, evt.newValue);
};

if (me.launchReasons.settingsChanged) {
  // Settings were changed while the companion was not running
  sendValue("background", settingsStorage.getItem("background"));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
    });
  }
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
