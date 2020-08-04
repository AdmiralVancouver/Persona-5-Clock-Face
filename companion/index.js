import { settingsStorage } from "settings";
import { me } from "companion";
import * as messaging from "messaging";

settingsStorage.onchange = (evt) => {
  let data = {
    key: evt.key,
    newValue: evt.newValue,
  };
  sendValue(data);
};

if (me.launchReasons.settingsChanged) {
  sendValue("background", settingsStorage.getItem("background"));
  sendValue(
    "heart_icon_display",
    settingsStorage.getItem("heart_icon_display")
  );
}

messaging.peerSocket.onopen = () => {
  restoreSettings();
};

function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        value: settingsStorage.getItem(key),
      };
      sendValue(data);
    }
  }
}

function sendValue(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
