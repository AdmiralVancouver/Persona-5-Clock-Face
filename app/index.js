import document from "document";
import { display } from "display";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from "appbit";
import { today } from "user-activity";

const hrmData = document.getElementById("heartrate_num");
const stepsData = document.getElementById("steps_num");
const day_of_week = document.getElementById("day_of_week");
const month_num = document.getElementById("month_num");
const day_num = document.getElementById("day_num");
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
  let d = evt.date;

  //console.log(d.getDay());
  setDayText(d.getDay());
  setMonth(d.getMonth());
  setDayNum(d.getDate());
};

function setDayText(day) {
  day_of_week.image = `day_text/${days[day]}.png`;
  if (day == 5) {
    day_of_week.width = 174;
    day_of_week.height = 81;
  }
}

function setMonth(month) {
  month_num.image = `month_number/${month + 1}.png`;
}

function setDayNum(num) {
  day_num.image = `day_number/${num}.png`;
}

