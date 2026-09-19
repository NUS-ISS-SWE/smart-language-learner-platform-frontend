import { test, expect } from "@playwright/test";
import { CompositionSession } from "../lib/composition-session";
import { composition } from "./fixtures";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

test("create, autosave and review share one write and flush the newest draft", async () => {
  const first = deferred<ReturnType<typeof composition>>();
  const writes: string[] = [];
  const session = new CompositionSession(null, {
    create: (draft) => {
      writes.push("create:" + draft.content);
      return first.promise;
    },
    update: async (id, draft) => {
      writes.push("update:" + draft.content);
      return composition(id, draft);
    },
    review: async (id) => {
      writes.push("review");
      return composition(id, { compositionStatus: "REVIEWING" });
    },
    generate: async () => composition(99),
  });
  session.update("title", "A garden");
  session.update("content", "<p>A</p>");
  const autosave = session.save(false);
  await expect.poll(() => writes.length).toBe(1);
  session.update("content", "<p>B</p>");
  const manual = session.save();
  const review = session.transition("review");
  expect(session.transition("review")).toBe(review);
  first.resolve(composition(42, { title: "A garden", content: "<p>A</p>" }));
  await Promise.all([autosave, manual, review]);
  expect(writes).toEqual(["create:<p>A</p>", "update:<p>B</p>", "review"]);
  expect(session.getSnapshot().draft.content).toBe("<p>B</p>");
  expect(session.getSnapshot().record?.compositionStatus).toBe("REVIEWING");
  expect(session.getSnapshot().dirty).toBe(false);
});

test("serial saves never replace newer input with an older acknowledgement", async () => {
  const pending = deferred<ReturnType<typeof composition>>();
  const writes: string[] = [];
  const session = new CompositionSession(composition(1), {
    create: async () => composition(2),
    generate: async () => composition(3),
    review: async () => composition(1),
    update: async (id, draft) => {
      writes.push(draft.content);
      return writes.length === 1 ? pending.promise : composition(id, draft);
    },
  });
  session.update("content", "<p>B</p>");
  const saving = session.save();
  await expect.poll(() => writes.length).toBe(1);
  session.update("content", "<p>C</p>");
  pending.resolve(composition(1, { content: "<p>B</p>" }));
  await saving;
  expect(writes).toEqual(["<p>B</p>", "<p>C</p>"]);
  expect(session.getSnapshot().draft.content).toBe("<p>C</p>");
  expect(session.getSnapshot().phase).toBe("saved");
});

test("unchanged assessed drafts and language-only changes produce zero updates", async () => {
  let writes = 0;
  const initial = composition(1, {
    compositionStatus: "REVIEWED",
    systemFeedback: "Keep this feedback.",
  });
  const session = new CompositionSession(initial, {
    create: async () => initial,
    generate: async () => initial,
    review: async () => initial,
    update: async () => {
      writes++;
      return initial;
    },
  });
  session.update("language", "CHINESE");
  await session.save();
  expect(writes).toBe(0);
  expect(session.getSnapshot().record?.systemFeedback).toBe(
    "Keep this feedback.",
  );
});

test("confirmed create rejection permits retry; ambiguous create requires acknowledgement", async () => {
  let calls = 0;
  let failure: unknown = { isAxiosError: true, response: { status: 400 } };
  const session = new CompositionSession(null, {
    create: async (draft) => {
      calls++;
      if (failure) throw failure;
      return composition(2, draft);
    },
    update: async () => composition(2),
    generate: async () => composition(3),
    review: async () => composition(2),
  });
  session.update("title", "A garden");
  session.update("content", "<p>Keep my words.</p>");
  await expect(session.save()).rejects.toBe(failure);
  failure = new Error("Network timeout");
  await expect(session.save()).rejects.toBe(failure);
  await expect(session.save()).rejects.toThrow("uncertainSave");
  expect(calls).toBe(2);
  failure = null;
  session.acknowledgeUncertainCreation();
  await session.save();
  expect(calls).toBe(3);
  expect(session.getSnapshot().draft.content).toBe("<p>Keep my words.</p>");
});

test("failed save blocks review and empty rich text cannot be submitted", async () => {
  let reviews = 0;
  const session = new CompositionSession(composition(1), {
    create: async () => composition(2),
    generate: async () => composition(3),
    update: async () => {
      throw { isAxiosError: true, response: { status: 400 } };
    },
    review: async () => {
      reviews++;
      return composition(1);
    },
  });
  session.update("content", "<p>New content</p>");
  await expect(session.transition("review")).rejects.toBeDefined();
  expect(session.getSnapshot().locked).toBe(false);
  session.update("content", "<p>&nbsp;</p>");
  await expect(session.transition("review")).rejects.toThrow("contentRequired");
  expect(reviews).toBe(0);
});

test("uncertain review stays locked until the user checks its server status", async () => {
  const session = new CompositionSession(composition(1), {
    create: async () => composition(2),
    update: async () => composition(1),
    generate: async () => composition(3),
    review: async () => {
      throw new Error("Network timeout");
    },
  });
  await expect(session.transition("review")).rejects.toThrow("Network timeout");
  session.update("content", "<p>Must not replace submitted content.</p>");
  expect(session.getSnapshot().draft.content).toBe(composition(1).content);
  expect(session.getSnapshot().locked).toBe(true);
});
