import handler from './api/scores.js';

function run(team) {
  return new Promise((resolve) => {
    const req = { query: { team } };
    const res = {
      headers: {},
      statusCode: 200,
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      send(body) { resolve({ statusCode: this.statusCode, body }); },
      json(obj) { resolve({ statusCode: this.statusCode, body: JSON.stringify(obj) }); }
    };
    handler(req, res);
  });
}

const out = await run('pittpanthers');
const data = JSON.parse(out.body);
const summary = {
  status: out.statusCode,
  all: Array.isArray(data.allGames) ? data.allGames.length : -1,
  upcoming: Array.isArray(data.upcomingGames) ? data.upcomingGames.length : -1,
  latest: data.latestGame?.gameDate || null
};
console.log(JSON.stringify(summary, null, 2));
