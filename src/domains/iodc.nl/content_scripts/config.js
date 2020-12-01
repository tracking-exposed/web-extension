import db from "src/background/db";

async function handleSetConfig(watcherName, exactId, hub) {
  const existprofile = await db.get(["PAADC"]);
  if(!existprofile) {
    console.log("Recording in DB the PAADC ID");
    return await db.set(["PAADC"], {
        exactId
    });
  } else if(exactId !== existprofile.exactId) {
    console.log("Unexpected condition: the new ID would overwrite the previous");
    await db.update(["PAACD"], {
        exactId
    });
  }
  console.log("user compiled the survey twice");
  return existprofile;
}

export default function register(hub) {
  hub.on("recordId", handleSetConfig);
}