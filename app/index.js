import document from "document";
import { display } from "display";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { preferences } from "user-settings";

const hrmData = document.getElementById("heartrate_num");
const stepsData = document.getElementById("steps_num");
const day_of_week = document.getElementById("day_of_week");
const month_num = document.getElementById("month_num");
const day_num = document.getElementById("day_num");
const hour_num = document.getElementById("hour_num");
const minute_num = document.getElementById("minute_num");
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

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate;

    // REMOVE (FOR TESTING)
    //stepsData.text = Math.pow(hrm.heartRate, 1);
  });
  sensors.push(hrm);
  hrm.start();
}

if (appbit.permissions.granted("access_activity")) {
  clock.addEventListener("tick", () => {
    stepsData.text = today.adjusted.steps || 0;
  });
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on
    ? sensors.map((sensor) => sensor.start())
    : sensors.map((sensor) => sensor.stop());
});

clock.ontick = (evt) => {
  /*
  let today = evt.date;

  setDayText(today.getDay());
  setMonth(today.getMonth());
  setDayNum(today.getDate());

  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }

  setHour(hours);
  setMinute(today.getMinutes());
  resizeTime(hours);
  */

  randomDate();
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

function resizeTime(hour) {
  if (hour >= 1 && hour <= 9) {
    hour_num.width = 175;
    hour_num.height = 192;
    hour_num.x = 75;
  } else {
    hour_num.width = 240;
    hour_num.height = 216;
    hour_num.x = 45;
  }
}

// tester function
function randomDate() {
  setDayText(Math.floor(Math.random() * 7));
  setMonth(Math.floor(Math.random() * 12));
  setDayNum(Math.floor(Math.random() * 30) + 1);
  let hour = Math.floor(Math.random() * 24);
  setHour(hour);
  resizeTime(hour);
  setMinute(Math.floor(Math.random() * 60));
}
