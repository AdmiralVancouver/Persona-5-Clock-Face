import document from "document";
import { display } from "display";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { preferences } from "user-settings";
import { me as device } from "device";
import * as messaging from "messaging";
import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

const hrmData = document.getElementById("heartrate_num");
const stepsData = document.getElementById("steps_num");
const day_of_week = document.getElementById("day_of_week");
const month_num = document.getElementById("month_num");
const day_num = document.getElementById("day_num");
const hour_num = document.getElementById("hour_num");
const minute_num = document.getElementById("minute_num");
const background = document.getElementById("background");

const sensors = [];
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const hrm = new HeartRateSensor();

clock.granularity = "seconds";

let settings = loadSettings();
applyTheme(settings.background);

// Apply new theme on settings change
messaging.peerSocket.onmessage = function (evt) {
  applyTheme(evt.data.value.values[0].name);
};

// detect for ionic devices running older firmware
if (!device.screen) {
  device.screen = { width: 348, height: 250 };
}
//console.log(`Dimensions: ${device.screen.width}x${device.screen.height}`);

// Stop and start heart rate sensor if on body presence
if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
      hrm.stop();
    } else {
      hrm.start();
    }
  });
  sensors.push(body);
  body.start();
}

// Check if heart rate permissions, then start or stop
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate;
  });
  sensors.push(hrm);
  hrm.start();
}

// Add event listener for steps counter
if (appbit.permissions.granted("access_activity")) {
  clock.addEventListener("tick", () => {
    stepsData.text = today.adjusted.steps || 0;
  });
}

// Automatically stop all sensors when the screen is off to conserve battery
display.addEventListener("change", () => {
  display.on
    ? sensors.map((sensor) => sensor.start())
    : sensors.map((sensor) => sensor.stop());
});

// Set proper time images, since not using a traditional font
clock.ontick = (evt) => {
  let today = evt.date;

  setDayText(today.getDay());
  setMonth(today.getMonth());
  setDayNum(today.getDate());

  let hours = today.getHours();
  autoBackground(settings.background, hours);
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }
  setHour(hours);
  setMinute(today.getMinutes());

  resizeTime(hours);

  // REMOVE FOR TESTING
  //randomDate();
};

function setDayText(day) {
  day_of_week.image = `day_text/${days[day]}.png`;
}

function setMonth(month) {
  month_num.image = `month_number/${month + 1}.png`;
}

function setDayNum(num) {
  day_num.image = `day_number/${num}.png`;
}

function setHour(hour) {
  hour_num.image = `hour_num/${hour}_hour.png`;
}

function setMinute(minute) {
  minute_num.image = `minute_num/${minute}_minute.png`;
}

// Check if Auto setting is applied to change background according to time of day
function autoBackground(isAuto, hour) {
  if (isAuto == "Auto") {
    if (hour >= 7 && hour <= 19) {
      background.image = "background/day_bg_300x300-contrast.png";
    } else if ((hour >= 20 && hour <= 23) || (hour >= 0 && hour <= 6)) {
      background.image = "background/night_bg_300x300-contrast.png";
    }
  }
}

function resizeTime300x300(hour) {
  if (hour == 7) {
    hour_num.width = 182;
    hour_num.height = 200;
    hour_num.x = 85;
  } else if (hour >= 1 && hour <= 9) {
    hour_num.width = 173;
    hour_num.height = 190;
    hour_num.x = 85;
  } else {
    hour_num.width = 230;
    hour_num.height = 207;
    hour_num.x = 45;
  }
}

function resizeTime348x250(hour) {
  if (hour == 7) {
    hour_num.width = 182;
    hour_num.height = 200;
    hour_num.x = 120;
  } else if (hour >= 1 && hour <= 9) {
    hour_num.width = 173;
    hour_num.height = 190;
    hour_num.x = 120;
  } else {
    hour_num.width = 230;
    hour_num.height = 207;
    hour_num.x = 80;
  }
}

// Resize and position appropriate time images
function resizeTime(hour) {
  if (device.screen.width == 348 && device.screen.height == 250) {
    resizeTime348x250(hour);
  } else if (device.screen.width == 300 && device.screen.height == 300) {
    resizeTime300x300(hour);
  }
}

// Register for the unload event
appbit.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {
      background: "Auto",
    };
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

// Apply appropriate theme according to settings
function applyTheme(background_settings) {
  if (background_settings == "Day") {
    background.image = "background/day_bg_300x300-contrast.png";
  } else if (background_settings == "Night") {
    background.image = "background/night_bg_300x300-contrast.png";
  }
  settings.background = background_settings;
}

// tester function
function randomDate() {
  setDayText(Math.floor(Math.random() * 7));
  setMonth(Math.floor(Math.random() * 12));
  setDayNum(Math.floor(Math.random() * 30) + 1);
  let hour = Math.floor(Math.random() * 24);
  autoBackground(settings.background, hour);
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hour = hour % 12 || 12;
  }
  setHour(hour);
  resizeTime(hour);
  setMinute(Math.floor(Math.random() * 60));
}
