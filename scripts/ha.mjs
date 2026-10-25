// HA admin helper: owner-provided environment only; never prints credentials.
import WebSocket from "ws";
const base = (process.env.HA_URL || "").replace(/\/$/, "");
export async function rest(
  path,
  data,
  method = data === undefined ? "GET" : "POST",
) {
  const response = await fetch(`${base}/api/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.HA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok)
    throw new Error(
      `${method} ${path}: HTTP ${response.status}: ${(await response.text()).slice(0, 250)}`,
    );
  return response.json();
}
export async function connect() {
  const ws = new WebSocket(base.replace(/^http/, "ws") + "/api/websocket");
  let id = 0;
  const pending = new Map();
  await new Promise((resolve, reject) => {
    ws.on("error", reject);
    ws.on("message", (raw) => {
      const r = JSON.parse(raw);
      if (r.type === "auth_required")
        ws.send(
          JSON.stringify({ type: "auth", access_token: process.env.HA_TOKEN }),
        );
      if (r.type === "auth_ok") resolve();
      if (r.type === "auth_invalid")
        reject(new Error("HA authentication failed"));
      if (r.type === "result" && pending.has(r.id)) {
        const p = pending.get(r.id);
        clearTimeout(p.timer);
        pending.delete(r.id);
        r.success
          ? p.resolve(r.result)
          : p.reject(new Error(JSON.stringify(r.error)));
      }
    });
  });
  return {
    call: (cmd) =>
      new Promise((resolve, reject) => {
        const n = ++id;
        pending.set(n, {
          resolve,
          reject,
          timer: setTimeout(() => {
            pending.delete(n);
            reject(new Error(`HA command timed out: ${cmd.type}`));
          }, 60000),
        });
        ws.send(JSON.stringify({ ...cmd, id: n }));
      }),
    close: () => ws.close(),
  };
}
