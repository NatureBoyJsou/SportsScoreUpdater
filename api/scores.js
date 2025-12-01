// api/steelers.js — Sleeper-based live NFL data

const TEAM = "PIT";  // Steelers
const CACHE_TTL = 20000;

let cache = { ts: 0, body: null };

// ESPN logos
const NFL_LOGOS = {
  PIT: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png",
  BUF: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
  CIN: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
  CHI: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  CLE: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png",
  BAL: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png",
  LAR: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png",
  SF:  "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
};

// Sleeper NFL
const SLEEPER_SCHEDULE =
  "https://api.sleeper.com/projections/nfl/2024?season_type=regular";

function normalizeGame(g) {
  return {
    idEvent: g.game_id,
    gameDate: new Date(g.game_start).toISOString(),
    status: g.status || "NS",

    home: {
      id: g.home_team,
      name: g.home_team,
      score: g.home_score,
      logo: NFL_LOGOS[g.home_team] || null
    },

    away: {
      id: g.away_team,
      name: g.away_team,
      score: g.away_score,
      logo: NFL_LOGOS[g.away_team] || null
    }
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const now = Date.now();
    if (cache.body && now - cache.ts < CACHE_TTL)
      return res.status(200).send(cache.body);

    const r = await fetch(SLEEPER_SCHEDULE);
    const data = await r.json();

    // Only Steelers games
    const games = data.filter(
      g => g.home_team === TEAM || g.away_team === TEAM
    );

    const sorted = games.sort((a,b) =>
      new Date(a.game_start) - new Date(b.game_start)
    );

    const past   = sorted.filter(g => new Date(g.game_start) < Date.now());
    const future = sorted.filter(g => new Date(g.game_start) >= Date.now());

    const lastGame = past.length ? normalizeGame(past[past.length - 1]) : null;
    const upcoming = future.map(normalizeGame);

    const payload = {
      team: "Pittsburgh Steelers",
      fetchedAt: new Date().toISOString(),
      latestGame: lastGame,
      nextGame: upcoming[0] || null,
      upcomingGames: upcoming
    };

    const body = JSON.stringify(payload);
    cache = { ts: now, body };

    return res.status(200).send(body);

  } catch (e) {
    return res.status(500).json({
      error: "Server error",
      details: e.message
    });
  }
}
