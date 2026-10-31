// Realtime Database writes hang silently when databaseURL is wrong or unreachable; fail loudly instead.
export const withTimeout = (p, ms = 12000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('timeout'), { code: 'db/timeout' })), ms))])
