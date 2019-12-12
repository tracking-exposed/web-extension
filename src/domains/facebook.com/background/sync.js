import { uuid, getTimeISO8601 } from "src/common/utils";
import db from "src/background/db";
import { getProfile } from "./profile";

const ALARM_NAME = "facebook.com:flush";
const MAX_BUFFER_SIZE = 1024 * 1024; // 1MB

async function estimateSize(profile) {
  return await db.get([profile.id, "events", "size"]);
}

async function flush(profile) {
  console.log("flush");
  db.set([profile.id, "events", "current"], {});
  db.set([profile.id, "events", "buffer"], []);
  await db.set([profile.id, "events", "size"], 0);
}

async function handleImpression(profile, data) {
  const { timelineId, position } = await db.get([
    profile.id,
    "events",
    "current"
  ]);
  const impression = {
    type: "impression",
    impressionOrder: position + 1,
    startTime: getTimeISO8601(),
    timelineId: timelineId,
    ...data
  };
  await db.update([profile.id, "events", "current"], {
    position: position + 1
  });
  await db.set(
    [profile.id, "events", "buffer"],
    list => [...list, impression],
    []
  );
  await db.set(
    [profile.id, "events", "size"],
    size => size + (data.html ? data.html.length : 0),
    0
  );
}

async function handleTimeline(profile, data) {
  const timeline = {
    type: "timeline",
    id: uuid(),
    startTime: getTimeISO8601(),
    location: data.location
  };
  await db.set([profile.id, "events", "current"], {
    timelineId: timeline.id,
    position: 1
  });
  await db.set(
    [profile.id, "events", "buffer"],
    list => [...list, timeline],
    []
  );
}

const HANDLERS = {
  impression: handleImpression,
  timeline: handleTimeline
};

browser.runtime.onConnect.addListener(port =>
  port.onMessage.addListener(async message => {
    console.log("Process start");
    //console.time("Message Handler");
    const profile = await getProfile();
    if (!profile) {
      return;
    }

    browser.alarms.clear(ALARM_NAME);
    browser.alarms.create(ALARM_NAME, {
      delayInMinutes: 1
    });

    const handler = HANDLERS[message.type];

    if (!handler) {
      console.error("Cannot find handler for type", message.type);
      return;
    }

    await handler(profile, message);
    const size = await estimateSize(profile);
    console.log("Buffer size", size);
    if (size > MAX_BUFFER_SIZE) {
      browser.alarms.clear(ALARM_NAME);
      flush(profile);
    }
    //console.timeEnd("Message Handler");
    console.log("Process end");
  })
);

browser.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === ALARM_NAME) {
    const profile = await getProfile();
    if (!profile) {
      return;
    }
    flush(profile);
  }
});
