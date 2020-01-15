import db from "./db";

test("should join arrays in a single key", () => {
  expect(db.join("a")).toBe("a");
  expect(db.join(["a", "b"])).toBe("a:b");
  expect(db.join(["a", "b", "c", "d"])).toBe("a:b:c:d");
  expect(db.join(["a", 1])).toBe("a:1");
});

test("should get values", async () => {
  browser.storage.local.get.mockReturnValue(
    Promise.resolve({
      smoking: "those meats"
    })
  );

  expect(await db.get("smoking")).toBe("those meats");
  expect(await db.get("meat")).toBe(undefined);
  expect(await db.get("meat", "brisket")).toBe("brisket");
});

test("should set values", async () => {
  browser.storage.local.get.mockReturnValue(
    Promise.resolve({
      smoking: "meat"
    })
  );

  await db.set("sauce", "sweet baby's ray");
  expect(browser.storage.local.set).lastCalledWith({
    sauce: "sweet baby's ray"
  });
  await db.set("smoking", s => s.toUpperCase());
  expect(browser.storage.local.set).lastCalledWith({
    smoking: "MEAT"
  });
  await db.set("meat", s => s.toUpperCase(), "brisket");
  expect(browser.storage.local.set).lastCalledWith({
    meat: "BRISKET"
  });
});

test("should update values", async () => {
  browser.storage.local.get.mockReturnValue(
    Promise.resolve({
      smoking: {
        what: "meat",
        like: "brisket"
      }
    })
  );

  await db.update("smoking", { sauce: "sweet baby's ray" });
  expect(browser.storage.local.set).lastCalledWith({
    smoking: {
      what: "meat",
      like: "brisket",
      sauce: "sweet baby's ray"
    }
  });
});
