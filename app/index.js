import document from "document";
import { display } from "display";
import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from "appbit";
import { today } from "user-activity";

//const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("heartrate_num");
const stepsData = document.getElementById("steps_num");
const sensors = [];
const hrm = new HeartRateSensor({ frequency: 1 });

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

if (HeartRateSensor) {
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate;

    // REMOVE
    //stepsData.text = hrm.heartRate * 123;
  });
  sensors.push(hrm);
  hrm.start();
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on
    ? sensors.map((sensor) => sensor.start())
    : sensors.map((sensor) => sensor.stop());
});

clock.ontick = (evt) => {
    stepsData.text = today.adjusted.steps || 0;
};
