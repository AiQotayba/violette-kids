const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: "info", msg, ...meta }));
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    console.error(JSON.stringify({ level: "error", msg, ...meta }));
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: "warn", msg, ...meta }));
  },
  debug: isDev
    ? (msg: string, meta?: Record<string, unknown>) => {
        console.debug(JSON.stringify({ level: "debug", msg, ...meta }));
      }
    : undefined,
};
