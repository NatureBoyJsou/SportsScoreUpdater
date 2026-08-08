import handler from './api/scores.js';

function mk() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = b; return this; },
    json(o) { this.body = JSON.stringify(o); return this; }
  };
}

async function run(team) {
  const req = { query: { team } };
  const res = mk();
  await handler(req, res);
  const j = JSON.parse(res.body);
  console.log('TEAM', team, 'STATUS', res.statusCode, 'UPCOMING', (j.upcomingGames || []).length, 'ALL', (j.allGames || []).length);
  console.log('LATEST', j.latestGame?.away?.name, '@', j.latestGame?.home?.name, j.latestGame?.gameDate, j.latestGame?.status);
  console.log('FIRST3', (j.allGames || []).slice(0, 3).map(g => ({ d: g.gameDate, h: g.home?.name, a: g.away?.name, s: g.status, tv: g.tvChannel })));
}

await run('pittpanthers');
await run('steelers');
