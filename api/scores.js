const CACHE_TTL = 20 * 1000; // 20 seconds
let cache = {}; // per-team cache

// ESPN LOGO LOOKUP TABLE (NFL, NHL, ACC, USL Championship)
const ESPN_LOGOS = {
  // ─────────── NFL TEAMS ───────────
  "Pittsburgh Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/pit.png",
  "Baltimore Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/bal.png",
  "Cleveland Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png",
  "Cincinnati Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cin.png",
  "Kansas City Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/kc.png",
  "Denver Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png",
  "Las Vegas Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lv.png",
  "Los Angeles Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lac.png",
  "Buffalo Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png",
  "Miami Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/mia.png",
  "New York Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyj.png",
  "New England Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png",
  "Houston Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/hou.png",
  "Jacksonville Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/jax.png",
  "Tennessee Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ten.png",
  "Indianapolis Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ind.png",
  "Philadelphia Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/phi.png",
  "Dallas Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/dal.png",
  "Washington Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/wsh.png",
  "New York Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyg.png",
  "San Francisco 49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sf.png",
  "Seattle Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png",
  "Los Angeles Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lar.png",
  "Arizona Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png",
  "Detroit Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/det.png",
  "Green Bay Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/gb.png",
  "Chicago Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/chi.png",
  "Minnesota Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/min.png",
  "Tampa Bay Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png",
  "Atlanta Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png",
  "New Orleans Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/no.png",
  "Carolina Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png",

  // ─────────── NHL TEAMS ───────────
  "Pittsburgh Penguins": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/pit.png",
  "Washington Capitals": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/wsh.png",
  "Chicago Blackhawks": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/chi.png",
  "Detroit Red Wings": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/det.png",
  "Boston Bruins": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/bos.png",
  "New York Rangers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/nyr.png",
  "Philadelphia Flyers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/phi.png",
  "Toronto Maple Leafs": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/tor.png",
  "Montreal Canadiens": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/mtl.png",
  "Vegas Golden Knights": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/vgk.png",
  "Colorado Avalanche": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/col.png",
  "Tampa Bay Lightning": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/tb.png&h=200&w=200",
  "Florida Panthers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/fla.png",
  "Dallas Stars": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/dal.png",
  "Los Angeles Kings": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/la.png",
  "San Jose Sharks": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/sj.png",

  // ─────────── ACC / NCAA
  "Pittsburgh Panthers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200",
  "Clemson Tigers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/228.png&h=200&w=200",
  "Florida State Seminoles": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/52.png&h=200&w=200",
  "North Carolina Tar Heels": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/153.png&h=200&w=200",
  "Virginia Cavaliers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/258.png&h=200&w=200",
  "Miami Hurricanes": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2390.png&h=200&w=200",
  "Boston College Eagles": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/103.png&h=200&w=200",
  "Louisville Cardinals": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/97.png&h=200&w=200",
  "Wake Forest Demon Deacons": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/154.png&h=200&w=200",
  "NC State Wolfpack": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/152.png&h=200&w=200",
  "Syracuse Orange": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/183.png&h=200&w=200",
  "Virginia Tech Hokies": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/259.png&h=200&w=200",
  "Duke Blue Devils": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/150.png&h=200&w=200",
  "Georgia Tech Yellow Jackets": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/59.png&h=200&w=200",
  "UCF Knights": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2116.png&h=200&w=200",
  "Miami (OH) RedHawks": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/193.png&h=200&w=200",
  "Pitt Panthers Soccer": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200",

  // ─────────── USL CHAMPIONSHIP (24 TEAMS)
  "Pittsburgh Riverhounds SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17827.png&h=200&w=200",
  "Birmingham Legion FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19405.png&h=200&w=200",
  "Charleston Battery": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9729.png&h=200&w=200",
  "Colorado Springs Switchbacks FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17830.png&h=200&w=200",
  "Detroit City FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19179.png&h=200&w=200",
  "El Paso Locomotive FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19407.png&h=200&w=200",
  "Hartford Athletic": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19411.png&h=200&w=200",
  "Indy Eleven": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17360.png&h=200&w=200",
  "Las Vegas Lights FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18987.png&h=200&w=200",
  "Loudoun United FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19410.png&h=200&w=200",
  "Louisville City FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17832.png&h=200&w=200",
  "Memphis 901 FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19409.png&h=200&w=200",
  "Miami FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18159.png&h=200&w=200",
  "Monterey Bay FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21370.png&h=200&w=200",
  "North Carolina FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9725.png&h=200&w=200",
  "New Mexico United": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19412.png&h=200&w=200",
  "Oakland Roots SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20687.png&h=200&w=200",
  "Orange County SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18455.png&h=200&w=200",
  "Phoenix Rising FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17850.png&h=200&w=200",
  "Rio Grande Valley FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18452.png&h=200&w=200",
  "Sacramento Republic FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17828.png&h=200&w=200",
  "Rhode Island FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/22164.png&h=200&w=200",
  "San Diego Loyal SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17829.png&h=200&w=200",
  "San Antonio FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18265.png&h=200&w=200",
  "Tampa Bay Rowdies": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17361.png&h=200&w=200",
  "FC Tulsa": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18446.png&h=200&w=200"
};

// Aliases — map alternate names from TheSportsDB to the ESPN keys above
const LOGO_ALIASES = {
  // USL aliases
  "Pittsburgh Riverhounds": "Pittsburgh Riverhounds SC",
  "Riverhounds SC": "Pittsburgh Riverhounds SC",
  "Riverhounds": "Pittsburgh Riverhounds SC",
  "Birmingham Legion": "Birmingham Legion FC",
  "Detroit City": "Detroit City FC",
  "El Paso Locomotive": "El Paso Locomotive FC",
  "Louisville City": "Louisville City FC",
  "Memphis 901": "Memphis 901 FC",
  "Las Vegas Lights": "Las Vegas Lights FC",
  "Loudoun United": "Loudoun United FC",
  "Oakland Roots": "Oakland Roots SC",
  "Phoenix Rising": "Phoenix Rising FC",
  "Rio Grande Valley Toros": "Rio Grande Valley FC",
  "Sacramento Republic": "Sacramento Republic FC",
  "San Diego Loyal": "San Diego Loyal SC",
  "Tulsa FC": "FC Tulsa",

  // NCAA/ACC aliases
  "Pitt": "Pittsburgh Panthers",
  "Pitt Panthers": "Pittsburgh Panthers",
  "Pittsburgh Panthers": "Pittsburgh Panthers", // canonical
  "Miami": "Miami Hurricanes",
  "Miami (FL)": "Miami Hurricanes",
  "North Carolina": "North Carolina Tar Heels",
  "UNC": "North Carolina Tar Heels",
  "NC State": "NC State Wolfpack",
  "NC State Wolfpack": "NC State Wolfpack",
  "Virginia Tech": "Virginia Tech Hokies",
  "Wake Forest": "Wake Forest Demon Deacons",
  "Boston College": "Boston College Eagles",
  "Clemson": "Clemson Tigers",
  "Duke": "Duke Blue Devils",
  "Florida State University": "Florida State Seminoles",
  "Georgia Tech": "Georgia Tech Yellow Jackets",
  "Georgia Tech Yellow Jackets": "Georgia Tech Yellow Jackets",
  "UCF": "UCF Knights",
  "Miami (OH)": "Miami (OH) RedHawks",
  "Miami OH": "Miami (OH) RedHawks",
  "Miami RedHawks": "Miami (OH) RedHawks",
  "Bucknell Bison": "Bucknell"
};

const NCAA_FOOTBALL_LOGO_IDS = {
  pittsburgpanthers: 221,
  miamioh: 193,
  miamiohredhawks: 193,
  ucf: 2116,
  ucfknights: 2116,
  syracuse: 183,
  syracuseorange: 183,
  bucknell: 2083,
  bucknellbison: 2083,
  virginiatech: 259,
  virginiatechhokies: 259,
  unc: 153,
  northcarolina: 153,
  northcarolinatarheels: 153,
  bostoncollege: 103,
  bostoncollegeeagles: 103,
  miami: 2390,
  miamifl: 2390,
  miamihurricanes: 2390,
  georgiatech: 59,
  georgiatechyellowjackets: 59,
  floridastate: 52,
  floridastateseminoles: 52,
  duke: 150,
  dukebluedevils: 150,
  ncstate: 152,
  ncstatewolfpack: 152,
  clemson: 228,
  clemsontigers: 228,
  louisville: 97,
  louisvillecardinals: 97,
  wakeforest: 154,
  wakeforestdemondeacons: 154,
  virginia: 258,
  virginiacavaliers: 258
};

function getNcaaLogoFromId(teamId) {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`;
}

function normalizeCollegeName(teamName) {
  return String(teamName || "")
    .toLowerCase()
    .replace(/#\d+/g, "")
    .replace(/\(\s*([^)]+)\s*\)/g, "$1")
    .replace(/\b(university|college|state)\b/g, " $1 ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getESPNLogo(teamName) {
  if (ESPN_LOGOS[teamName]) return ESPN_LOGOS[teamName];
  if (LOGO_ALIASES[teamName] && ESPN_LOGOS[LOGO_ALIASES[teamName]]) {
    return ESPN_LOGOS[LOGO_ALIASES[teamName]];
  }
  const simplified = teamName.replace(/\s+(Football|Soccer|Men's|Women's).*$/i, '').trim();
  if (ESPN_LOGOS[simplified]) return ESPN_LOGOS[simplified];
  if (LOGO_ALIASES[simplified] && ESPN_LOGOS[LOGO_ALIASES[simplified]]) {
    return ESPN_LOGOS[LOGO_ALIASES[simplified]];
  }
  const normalizedKey = Object.keys(ESPN_LOGOS).find(k => k.toLowerCase() === teamName.toLowerCase());
  if (normalizedKey) return ESPN_LOGOS[normalizedKey];

  const normalizedCollegeName = normalizeCollegeName(teamName);
  if (NCAA_FOOTBALL_LOGO_IDS[normalizedCollegeName]) {
    return getNcaaLogoFromId(NCAA_FOOTBALL_LOGO_IDS[normalizedCollegeName]);
  }

  if (/pitt/i.test(teamName)) return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200";
  return "https://via.placeholder.com/48?text=?";
}

const STEELERS_TV_BY_WEEK = {
  1: "WPGH",
  2: "KDKA",
  3: "KDKA",
  4: "AMAZON PRIME",
  5: "KDKA",
  6: "KDKA",
  7: "NFL NETWORK",
  8: "KDKA",
  9: "NONE (BYE)",
  10: "WPXI",
  11: "KDKA",
  12: "AMAZON PRIME",
  13: "WPXI",
  14: "ESPN",
  15: "KDKA",
  16: "TBD",
  17: "KDKA",
  18: "TBD"
};

const STEELERS_PRESEASON_TV_BY_OPPONENT = {
  "Green Bay Packers": "KDKA",
  "New York Jets": "KDKA",
  "Buffalo Bills": "KDKA"
};

const PITT_FOOTBALL_BROADCAST_BY_OPPONENT = {
  "miamioh": { tv: "The CW", radio: "93.7 The Fan" },
  "ucf": { tv: "ESPN2", radio: "93.7 The Fan" },
  "syracuse": { tv: "ESPN", radio: "93.7 The Fan" },
  "bucknell": { tv: "ACCNX", radio: "93.7 The Fan" },
  "virginiatech": { tv: "ESPN", radio: "93.7 The Fan" },
  "northcarolina": { tv: "TBD", radio: "93.7 The Fan" },
  "bostoncollege": { tv: "TBD", radio: "93.7 The Fan" },
  "miami": { tv: "TBD", radio: "93.7 The Fan" },
  "georgiatech": { tv: "TBD", radio: "93.7 The Fan" },
  "floridastate": { tv: "ESPN", radio: "93.7 The Fan" },
  "louisville": { tv: "TBD", radio: "93.7 The Fan" },
  "california": { tv: "TBD", radio: "93.7 The Fan" }
};

function normalizePittOpponent(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\(\s*oh\s*\)/g, "oh")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getPittFootballBroadcast(homeTeam, awayTeam) {
  const opponent = homeTeam === "Pittsburgh Panthers" ? awayTeam : homeTeam;
  const key = normalizePittOpponent(opponent);
  return PITT_FOOTBALL_BROADCAST_BY_OPPONENT[key] || { tv: "TBD", radio: "93.7 The Fan" };
}

function getSteelersTV(gameDateISO, roundRaw, homeTeam, awayTeam) {
  const opponent = homeTeam === "Pittsburgh Steelers" ? awayTeam : homeTeam;
  if (opponent && STEELERS_PRESEASON_TV_BY_OPPONENT[opponent]) {
    return STEELERS_PRESEASON_TV_BY_OPPONENT[opponent];
  }

  const round = Number(roundRaw);
  if (Number.isInteger(round) && STEELERS_TV_BY_WEEK[round]) return STEELERS_TV_BY_WEEK[round];
  if (!gameDateISO || gameDateISO === "TBD") return "TBD";
  const d = new Date(gameDateISO);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });
  const parts = dtf.formatToParts(d);
  let hour = null, minute = null, weekday = null;
  for (const p of parts) {
    if (p.type === "hour") hour = parseInt(p.value, 10);
    if (p.type === "minute") minute = parseInt(p.value, 10);
    if (p.type === "weekday") weekday = p.value;
  }
  const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const day = dayMap[weekday] ?? d.getDay();
  if (day === 0) { if(hour===13) return "KDKA"; if(hour===20) return "WPGH"; }
  if(day===4) return "AMAZON PRIME";
  if(day===1) return "ESPN";
  return "TBD";
}

function formatGame(g, future=false, teamKey=null) {
  if(!g) return null;
  let gameDate;
  if(g.dateEvent && g.strTime) gameDate = `${g.dateEvent}T${g.strTime}`;
  else if(g.strTimestamp) gameDate = g.strTimestamp;
  else gameDate = "TBD";

  let homeScore = null;
  let awayScore = null;
  if(!future){
    homeScore = g.intHomeScore!=null?Number(g.intHomeScore):g.intHomeScoreTotal!=null?Number(g.intHomeScoreTotal):null;
    awayScore = g.intAwayScore!=null?Number(g.intAwayScore):g.intAwayScoreTotal!=null?Number(g.intAwayScoreTotal):null;
  }

  const pittBroadcast = teamKey === "pittpanthers"
    ? getPittFootballBroadcast(g.strHomeTeam, g.strAwayTeam)
    : null;

  const homeLogo = g.strHomeBadge || getESPNLogo(g.strHomeTeam);
  const awayLogo = g.strAwayBadge || getESPNLogo(g.strAwayTeam);

  return {
    idEvent:g.idEvent,
    gameDate,
    status:g.strStatus||(future?"NS":"FT"),
    tvChannel:
      teamKey === "steelers"
        ? (g.strTVStation || getSteelersTV(gameDate, g.intRound, g.strHomeTeam, g.strAwayTeam))
        : teamKey === "pittpanthers"
          ? (pittBroadcast?.tv || g.strTVStation || "TBD")
          : (g.strTVStation || "TBD"),
    radioChannel:
      teamKey === "pittpanthers"
        ? (pittBroadcast?.radio || g.strRadioStation || "93.7 The Fan")
        : (g.strRadioStation || ""),
    home:{ id:g.idHomeTeam, name:g.strHomeTeam, score:homeScore, logo:homeLogo, strTeamBadge:homeLogo},
    away:{ id:g.idAwayTeam, name:g.strAwayTeam, score:awayScore, logo:awayLogo, strTeamBadge:awayLogo}
  };
}

function decodeHtmlEntities(value) {
  if (!value) return "";
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSteelersGameTime(rawGameTime, fallbackIso) {
  if (rawGameTime && !rawGameTime.startsWith("01/01/0001")) {
    const m = rawGameTime.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+([+-]\d{2}):(\d{2})$/
    );
    if (m) {
      const [, mm, dd, yyyy, hh, min, ss, tzH, tzM] = m;
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${tzH}:${tzM}`;
    }
  }
  if (fallbackIso) {
    const parsed = new Date(fallbackIso);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return "TBD";
}

function parseSteelersGamesFromHtml(html) {
  const games = [];
  const cardRegex = /<div class="nfl-o-matchup-cards([^\"]*)"([^>]*)>([\s\S]*?)<\/div>\s*<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const classSuffix = match[1] || "";
    const attrs = match[2] || "";
    const cardHtml = match[3] || "";
    const ldJsonRaw = decodeHtmlEntities(match[4] || "");

    let ld;
    try {
      ld = JSON.parse(ldJsonRaw);
    } catch {
      continue;
    }

    const homeTeam = ld?.homeTeam?.name;
    const awayTeam = ld?.awayTeam?.name;
    if (!homeTeam || !awayTeam) continue;

    const gameIdMatch = attrs.match(/data-gameid="([^\"]+)"/i);
    const gameTimeMatch = attrs.match(/data-gametime="([^\"]+)"/i);
    const weekMatch = cardHtml.match(/<strong>\s*WEEK\s*(\d+)\s*<\/strong>/i);
    const tvMatch = cardHtml.match(/nfl-o-matchup-cards__media-tv--networks">\s*([^<]+)\s*</i);
    const scoreMatches = [...cardHtml.matchAll(/nfl-o-matchup-cards__team-score[^>]*>\s*(\d+)\s*</gi)];

    const gameDate = parseSteelersGameTime(gameTimeMatch?.[1], ld?.startDate);

    let status = "NS";
    if (/--post-game/i.test(classSuffix)) status = "FT";
    else if (/--in-game/i.test(classSuffix)) status = "LIVE";

    if (ld?.eventStatus === "https://schema.org/EventCancelled") status = "CANC";
    if (ld?.eventStatus === "https://schema.org/EventPostponed") status = "PPD";

    let homeScore = null;
    let awayScore = null;
    if (scoreMatches.length >= 2) {
      homeScore = Number(scoreMatches[0][1]);
      awayScore = Number(scoreMatches[1][1]);
    }

    games.push({
      idEvent: gameIdMatch?.[1] || ld?.["@id"] || `${homeTeam}-${awayTeam}-${gameDate}`,
      dateEvent: gameDate !== "TBD" ? gameDate.slice(0, 10) : null,
      strTime: gameDate !== "TBD" ? gameDate.slice(11, 19) : null,
      strTimestamp: gameDate,
      strStatus: status,
      intRound: weekMatch ? Number(weekMatch[1]) : null,
      strTVStation: decodeHtmlEntities(tvMatch?.[1] || ""),
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      intHomeScore: homeScore,
      intAwayScore: awayScore
    });
  }

  return games;
}

async function fetchSteelersGamesFromSite() {
  const url = "https://www.steelers.com/schedule/";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml"
    }
  });

  if (!res.ok) throw new Error(`Steelers schedule fetch failed: ${res.status}`);
  const html = await res.text();
  const games = parseSteelersGamesFromHtml(html);
  if (!games.length) throw new Error("Steelers schedule parse returned 0 games");
  return games;
}

function extractPanthersPayloadPath(html) {
  if (!html) return null;
  const direct = html.match(/\/sports\/football\/schedule\/_payload\.json\?[^"'\s<]+/i);
  if (direct?.[0]) return direct[0];
  const hrefMatch = html.match(/href="([^\"]*\/sports\/football\/schedule\/_payload\.json\?[^\"]+)"/i);
  if (hrefMatch?.[1]) return hrefMatch[1];
  return null;
}

function looksLikePanthersGame(obj) {
  if (!obj || typeof obj !== "object") return false;
  const hasDate = typeof obj.date === "string" || typeof obj.game_date === "string";
  const opponent = obj.opponent;
  const hasOpponent =
    (opponent && typeof opponent === "object" && (opponent.title || opponent.name)) ||
    typeof obj.opponent_title === "string" ||
    typeof obj.opponent_name === "string";
  return Boolean(hasDate && hasOpponent);
}

function findPanthersGamesInPayload(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node)) {
    for (const item of node) findPanthersGamesInPayload(item, out);
    return out;
  }
  if (typeof node !== "object") return out;
  if (looksLikePanthersGame(node)) out.push(node);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") findPanthersGamesInPayload(value, out);
  }
  return out;
}

function normalizePanthersStatus(rawStatus, gameStateRaw, homeScore, awayScore) {
  const status = String(rawStatus || "").toUpperCase();
  if (status.includes("FINAL")) return "FT";
  if (status.includes("LIVE") || status.includes("PROGRESS") || status.includes("IN GAME")) return "LIVE";
  if (status.includes("POSTPON")) return "PPD";
  if (status.includes("CANCEL")) return "CANC";

  const gameState = Number(gameStateRaw);
  if (!Number.isNaN(gameState)) {
    if (gameState >= 400) return "FT";
    if (gameState >= 330 && gameState < 400) return "LIVE";
  }

  if (homeScore != null && awayScore != null) return "FT";
  return "NS";
}

function parsePanthersGamesFromPayload(payload) {
  const candidates = findPanthersGamesInPayload(payload);
  const normalized = [];

  for (const g of candidates) {
    const opponentName =
      g?.opponent?.title || g?.opponent?.name || g?.opponent_title || g?.opponent_name || "Opponent";

    const atVs = String(g?.at_vs || g?.atVs || "").trim().toLowerCase();
    const isHome = atVs === "vs" || atVs === "home" || atVs === "h";
    const isAway = atVs === "at" || atVs === "away" || atVs === "a";

    const homeTeam = isAway ? opponentName : "Pittsburgh Panthers";
    const awayTeam = isAway ? "Pittsburgh Panthers" : opponentName;

    const homeScoreRaw = g?.home_score ?? g?.homeScore ?? g?.score_home ?? null;
    const awayScoreRaw = g?.away_score ?? g?.awayScore ?? g?.score_away ?? null;
    const homeScore = homeScoreRaw != null && homeScoreRaw !== "" ? Number(homeScoreRaw) : null;
    const awayScore = awayScoreRaw != null && awayScoreRaw !== "" ? Number(awayScoreRaw) : null;

    const status = normalizePanthersStatus(g?.status, g?.game_state, homeScore, awayScore);
    const tv = g?.media?.tv || g?.tv || g?.broadcast || "";

    const rawDate = g?.date || g?.game_date || null;
    let dateEvent = null;
    let strTime = null;
    let strTimestamp = "TBD";
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime())) {
        strTimestamp = parsed.toISOString();
        dateEvent = strTimestamp.slice(0, 10);
        strTime = strTimestamp.slice(11, 19);
      }
    }

    normalized.push({
      idEvent: String(g?.id || g?.game_id || `${dateEvent || "tbd"}-${opponentName}-${atVs || "x"}`),
      dateEvent,
      strTime,
      strTimestamp,
      strStatus: status,
      intRound: g?.week ?? null,
      strTVStation: tv || "TBD",
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      intHomeScore: Number.isFinite(homeScore) ? homeScore : null,
      intAwayScore: Number.isFinite(awayScore) ? awayScore : null
    });
  }

  const deduped = [];
  const seen = new Set();
  for (const g of normalized) {
    const key = `${g.dateEvent || "tbd"}|${g.strHomeTeam}|${g.strAwayTeam}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(g);
  }

  deduped.sort((a, b) => {
    const ta = a.strTimestamp && a.strTimestamp !== "TBD" ? new Date(a.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.strTimestamp && b.strTimestamp !== "TBD" ? new Date(b.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });

  return deduped;
}

function parseEspnScheduleDateLabel(dateLabel, seasonYear) {
  const m = String(dateLabel || "").match(/^[A-Za-z]{3},\s*([A-Za-z]{3})\s*(\d{1,2})$/);
  if (!m) return null;
  const monthMap = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const month = monthMap[m[1].toLowerCase()];
  const day = Number(m[2]);
  if (!month || !day) return null;
  return `${seasonYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseEspnTimeLabel(timeLabel) {
  const raw = String(timeLabel || "").trim();
  if (!raw || /^tbd$/i.test(raw)) return null;

  const tm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!tm) return null;
  let hh = Number(tm[1]);
  const mm = Number(tm[2]);
  const meridian = tm[3].toUpperCase();
  if (meridian === "PM" && hh < 12) hh += 12;
  if (meridian === "AM" && hh === 12) hh = 0;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
}

function parsePittGamesFromEspnHtml(html) {
  const seasonMatch = html.match(/Pittsburgh Panthers Schedule\s*(\d{4})/i);
  const seasonYear = seasonMatch ? Number(seasonMatch[1]) : new Date().getUTCFullYear();

  const rowRegex = /<tr[^>]*data-idx="\d+"[^>]*>([\s\S]*?)<\/tr>/gi;
  const games = [];
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1] || "";
    if (!/data-testid="date"/i.test(row) || !/data-testid="opponent"/i.test(row)) continue;

    const dateLabel = stripHtmlTags((row.match(/<span[^>]*data-testid="date"[^>]*>([\s\S]*?)<\/span>/i) || [])[1]);
    const opponentCell = (row.match(/<div[^>]*data-testid="opponent"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "";
    const opponent = stripHtmlTags((opponentCell.match(/<a[^>]*>\s*([^<]+?)\s*<!--/) || opponentCell.match(/<a[^>]*>\s*([^<]+?)\s*<\/a>/i) || [])[1] || "Opponent");
    const atVs = stripHtmlTags((opponentCell.match(/<span[^>]*class="pr2"[^>]*>([\s\S]*?)<\/span>/i) || [])[1]);
    const timeLabel = stripHtmlTags((row.match(/<span[^>]*data-testid="time"[^>]*>([\s\S]*?)<\/span>/i) || [])[1]);

    const networkBlock = (row.match(/<div[^>]*data-testid="network"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "";
    const networkClass = (networkBlock.match(/network-([a-z0-9-]+)/i) || [])[1] || "";
    const network = networkClass
      ? networkClass
          .replace(/-/g, " ")
          .replace(/\b[a-z]/g, c => c.toUpperCase())
      : "";

    const dateEvent = parseEspnScheduleDateLabel(dateLabel, seasonYear);
    if (!dateEvent) continue;
    const strTime = parseEspnTimeLabel(timeLabel);
    const strTimestamp = strTime ? `${dateEvent}T${strTime}Z` : "TBD";

    const isAway = /^@$/i.test(atVs);
    games.push({
      idEvent: `espn-pitt-${dateEvent}-${opponent}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      dateEvent,
      strTime,
      strTimestamp,
      strStatus: "NS",
      intRound: null,
      strTVStation: network,
      strHomeTeam: isAway ? opponent : "Pittsburgh Panthers",
      strAwayTeam: isAway ? "Pittsburgh Panthers" : opponent,
      intHomeScore: null,
      intAwayScore: null
    });
  }

  return games;
}

async function fetchPittPanthersGamesFromEspn() {
  const url = "https://www.espn.com/college-football/team/schedule/_/id/221/pittsburgh-panthers";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml"
    }
  });
  if (!res.ok) throw new Error(`ESPN Pitt schedule fetch failed: ${res.status}`);

  const html = await res.text();
  const games = parsePittGamesFromEspnHtml(html);
  if (!games.length) throw new Error("ESPN Pitt schedule parse returned 0 games");
  return games;
}

async function fetchPittPanthersGamesFromSite() {
  try {
    const pageUrl = "https://pittsburghpanthers.com/sports/football/schedule";
    const pageRes = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
    if (!pageRes.ok) throw new Error(`Pitt schedule page fetch failed: ${pageRes.status}`);

    const html = await pageRes.text();
    const payloadPath = extractPanthersPayloadPath(html);
    if (!payloadPath) throw new Error("Pitt payload URL not found in schedule page");

    const payloadUrl = payloadPath.startsWith("http")
      ? payloadPath
      : `https://pittsburghpanthers.com${payloadPath.startsWith("/") ? "" : "/"}${payloadPath}`;

    const payloadRes = await fetch(payloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json,text/plain,*/*"
      }
    });
    if (!payloadRes.ok) throw new Error(`Pitt payload fetch failed: ${payloadRes.status}`);

    const payloadJson = await payloadRes.json();
    const games = parsePanthersGamesFromPayload(payloadJson);
    if (games.length) return games;
  } catch (e) {
    console.warn("Pitt official source failed, using ESPN schedule fallback:", e.message || e);
  }

  return fetchPittPanthersGamesFromEspn();
}

function normalizeNhlStatus(state) {
  const s = String(state || "").toUpperCase();
  if (s === "FINAL" || s === "OFF") return "FT";
  if (s === "LIVE" || s === "CRIT") return "LIVE";
  if (s === "PRE" || s === "FUT") return "NS";
  return "NS";
}

function formatNhlTeamName(team) {
  if (!team) return "Unknown Team";
  const place = team?.placeName?.default || "";
  const common = team?.commonName?.default || "";
  return `${place} ${common}`.trim();
}

function parseNhlGamesList(games) {
  return (games || []).map(g => {
    const awayScore = Number.isFinite(g?.awayTeam?.score) ? Number(g.awayTeam.score) : null;
    const homeScore = Number.isFinite(g?.homeTeam?.score) ? Number(g.homeTeam.score) : null;
    const tv = Array.isArray(g?.tvBroadcasts)
      ? g.tvBroadcasts
          .map(t => t?.network)
          .filter(Boolean)
          .join(" / ")
      : "";

    return {
      idEvent: String(g?.id || `${g?.gameDate || "tbd"}-${g?.awayTeam?.abbrev || "a"}-${g?.homeTeam?.abbrev || "h"}`),
      dateEvent: g?.gameDate || null,
      strTime: g?.startTimeUTC ? new Date(g.startTimeUTC).toISOString().slice(11, 19) : null,
      strTimestamp: g?.startTimeUTC ? new Date(g.startTimeUTC).toISOString() : "TBD",
      strStatus: normalizeNhlStatus(g?.gameState),
      strTVStation: tv || "TBD",
      strRadioStation: g?.homeTeam?.radioLink || g?.awayTeam?.radioLink || "",
      strHomeTeam: formatNhlTeamName(g?.homeTeam),
      strAwayTeam: formatNhlTeamName(g?.awayTeam),
      intHomeScore: homeScore,
      intAwayScore: awayScore
    };
  });
}

function getNhlSeasonId(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const startYear = m >= 6 ? y : y - 1;
  return `${startYear}${startYear + 1}`;
}

async function fetchPenguinsGamesFromNhlSite() {
  const currentSeason = getNhlSeasonId(new Date());
  const previousSeason = String(Number(currentSeason) - 10001);
  const seasonIds = [currentSeason, previousSeason];
  const allGames = [];

  for (const seasonId of seasonIds) {
    const url = `https://api-web.nhle.com/v1/club-schedule-season/PIT/${seasonId}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json,text/plain,*/*"
      }
    });
    if (!res.ok) continue;
    const json = await res.json();
    allGames.push(...parseNhlGamesList(json?.games || []));
  }

  const deduped = [];
  const seen = new Set();
  for (const g of allGames) {
    if (seen.has(g.idEvent)) continue;
    seen.add(g.idEvent);
    deduped.push(g);
  }

  if (!deduped.length) throw new Error("NHL Penguins schedule parse returned 0 games");
  deduped.sort((a, b) => {
    const ta = a.strTimestamp && a.strTimestamp !== "TBD" ? new Date(a.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.strTimestamp && b.strTimestamp !== "TBD" ? new Date(b.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });
  return deduped;
}

function parseRiverhoundsDateTime(monthDayRaw, timeRaw, year) {
  const md = String(monthDayRaw || "").trim().match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (!md) return "TBD";
  const monthMap = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  const monthIdx = monthMap[md[1].toLowerCase()];
  if (monthIdx == null) return "TBD";
  const day = Number(md[2]);

  let hours = 12;
  let minutes = 0;
  const t = String(timeRaw || "").toLowerCase().replace(/\./g, "").trim();
  const tm = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(a|p)m$/);
  if (tm) {
    hours = Number(tm[1]);
    minutes = Number(tm[2] || 0);
    const meridian = tm[3];
    if (meridian === "p" && hours < 12) hours += 12;
    if (meridian === "a" && hours === 12) hours = 0;
  } else if (t.includes("noon")) {
    hours = 12;
    minutes = 0;
  } else if (t.includes("tbd")) {
    return "TBD";
  }

  const date = new Date(Date.UTC(year, monthIdx, day, hours, minutes, 0));
  return Number.isNaN(date.getTime()) ? "TBD" : date.toISOString();
}

function stripHtmlTags(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseRiverhoundsGamesFromHtml(html) {
  const yearMatch = html.match(/<h1[^>]*class="entry-title"[^>]*>(\d{4})\s+Schedule<\/h1>/i);
  const seasonYear = yearMatch ? Number(yearMatch[1]) : new Date().getUTCFullYear();
  const cardRegex = /<div class="NewGame\s+GameContainer\s+([^"]+)"[\s\S]*?<\/div>\s*<\/div>\s*<!-- END OF MATCH/gi;
  const games = [];
  let m;

  while ((m = cardRegex.exec(html)) !== null) {
    const classTokens = m[1] || "";
    const block = m[0] || "";
    const isAway = /\bAwayGame\b/.test(classTokens);
    const isCompleted = /\bCompleted\b/.test(classTokens);

    const monthDay = stripHtmlTags((block.match(/<div class="gametext">\s*([A-Za-z]+\s+\d{1,2})\s*<\/div>/i) || [])[1]);
    const timeRaw = stripHtmlTags((block.match(/<div class="gametext">\s*([^<]+?)\s*<\/div>\s*<\/div>\s*<div class="Opponent">/i) || [])[1]);
    const oppCity = stripHtmlTags((block.match(/<h4 class="Opponent-city">([\s\S]*?)<\/h4>/i) || [])[1]);
    const oppNick = stripHtmlTags((block.match(/<h4 class="Opponent-nickname">([\s\S]*?)<\/h4>/i) || [])[1]);
    const venue = stripHtmlTags((block.match(/<div class="Promotion">[\s\S]*?<h5>([\s\S]*?)<\/h5>/i) || [])[1]);

    const tvLinks = [...block.matchAll(/<div class="Broadcast">[\s\S]*?<a [^>]*>([\s\S]*?)<\/a>/gi)]
      .map(x => stripHtmlTags(x[1]))
      .filter(Boolean);

    const opponent = [oppCity, oppNick].filter(Boolean).join(" ").trim() || "Opponent";
    const ts = parseRiverhoundsDateTime(monthDay, timeRaw, seasonYear);
    const homeTeam = isAway ? opponent : "Pittsburgh Riverhounds SC";
    const awayTeam = isAway ? "Pittsburgh Riverhounds SC" : opponent;

    games.push({
      idEvent: `rh-${seasonYear}-${monthDay.replace(/\s+/g, "-")}-${opponent.replace(/\s+/g, "-")}`.toLowerCase(),
      dateEvent: ts !== "TBD" ? ts.slice(0, 10) : null,
      strTime: ts !== "TBD" ? ts.slice(11, 19) : null,
      strTimestamp: ts,
      strStatus: isCompleted ? "FT" : "NS",
      strTVStation: tvLinks.length ? tvLinks.join(" / ") : "TBD",
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      strVenue: venue,
      intHomeScore: null,
      intAwayScore: null
    });
  }

  if (!games.length) throw new Error("Riverhounds schedule parse returned 0 games");
  return games;
}

async function fetchRiverhoundsGamesFromSite() {
  const url = "https://www.riverhounds.com/schedule/";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml"
    }
  });
  if (!res.ok) throw new Error(`Riverhounds schedule fetch failed: ${res.status}`);
  const html = await res.text();
  const games = parseRiverhoundsGamesFromHtml(html);

  const currentYear = new Date().getUTCFullYear();
  const currentSeasonGames = games.filter(g => String(g.dateEvent || "").startsWith(`${currentYear}-`));
  if (currentSeasonGames.length >= 6) {
    return currentSeasonGames;
  }

  return games;
}

function normalizeTeamSlug(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function mergeRiverhoundsScores(siteGames, dbGames) {
  if (!Array.isArray(siteGames) || !Array.isArray(dbGames) || !dbGames.length) return siteGames;
  return siteGames.map(g => {
    const gDate = g?.dateEvent;
    const gOpp = g.strHomeTeam === "Pittsburgh Riverhounds SC" ? g.strAwayTeam : g.strHomeTeam;
    const gOppSlug = normalizeTeamSlug(gOpp);

    const match = dbGames.find(d => {
      const dDate = d?.dateEvent || d?.strTimestamp?.slice?.(0, 10);
      if (!dDate || !gDate || dDate !== gDate) return false;
      const dOpp = d.strHomeTeam === "Pittsburgh Riverhounds SC" ? d.strAwayTeam : d.strHomeTeam;
      return normalizeTeamSlug(dOpp) === gOppSlug;
    });

    if (!match) return g;
    return {
      ...g,
      intHomeScore: match.intHomeScore != null ? Number(match.intHomeScore) : g.intHomeScore,
      intAwayScore: match.intAwayScore != null ? Number(match.intAwayScore) : g.intAwayScore,
      strStatus: match.strStatus === "LIVE" ? "LIVE" : (match.strStatus === "FT" ? "FT" : g.strStatus)
    };
  });
}

function normalizeMlbStatus(abstractState, detailedState) {
  const abstract = String(abstractState || "").toLowerCase();
  const detailed = String(detailedState || "").toLowerCase();
  if (abstract.includes("final") || detailed.includes("final")) return "FT";
  if (abstract.includes("live") || abstract.includes("in progress") || detailed.includes("in progress")) return "LIVE";
  if (abstract.includes("postponed") || detailed.includes("postponed")) return "PPD";
  if (abstract.includes("cancelled") || detailed.includes("cancelled")) return "CANC";
  return "NS";
}

function getMlbTeamLogo(teamId) {
  if (!teamId) return "";
  return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
}

function parseMlbPiratesGamesFromScheduleJson(payload) {
  const out = [];
  const dates = Array.isArray(payload?.dates) ? payload.dates : [];

  for (const dateBlock of dates) {
    const games = Array.isArray(dateBlock?.games) ? dateBlock.games : [];
    for (const g of games) {
      const homeTeam = g?.teams?.home?.team;
      const awayTeam = g?.teams?.away?.team;
      if (!homeTeam?.name || !awayTeam?.name) continue;

      const gameDate = g?.gameDate ? new Date(g.gameDate).toISOString() : "TBD";
      const tvNames = [
        ...(Array.isArray(g?.broadcasts?.tv) ? g.broadcasts.tv.map(b => b?.name) : []),
        ...(Array.isArray(g?.broadcasts?.radio) ? g.broadcasts.radio.map(b => b?.name) : [])
      ].filter(Boolean);

      out.push({
        idEvent: String(g?.gamePk || `${dateBlock?.date}-${awayTeam.name}-${homeTeam.name}`),
        dateEvent: gameDate !== "TBD" ? gameDate.slice(0, 10) : null,
        strTime: gameDate !== "TBD" ? gameDate.slice(11, 19) : null,
        strTimestamp: gameDate,
        strStatus: normalizeMlbStatus(g?.status?.abstractGameState, g?.status?.detailedState),
        strTVStation: tvNames.join(" / ") || "TBD",
        strHomeTeam: homeTeam.name,
        strAwayTeam: awayTeam.name,
        idHomeTeam: homeTeam.id ? String(homeTeam.id) : null,
        idAwayTeam: awayTeam.id ? String(awayTeam.id) : null,
        strHomeBadge: getMlbTeamLogo(homeTeam.id),
        strAwayBadge: getMlbTeamLogo(awayTeam.id),
        intHomeScore: Number.isFinite(g?.teams?.home?.score) ? Number(g.teams.home.score) : null,
        intAwayScore: Number.isFinite(g?.teams?.away?.score) ? Number(g.teams.away.score) : null
      });
    }
  }

  return out;
}

async function fetchPiratesGamesFromMlbSite() {
  const season = new Date().getUTCFullYear();
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=134&season=${season}&hydrate=broadcasts(all),linescore`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json,text/plain,*/*"
    }
  });
  if (!res.ok) throw new Error(`MLB Pirates schedule fetch failed: ${res.status}`);

  const json = await res.json();
  const games = parseMlbPiratesGamesFromScheduleJson(json);
  if (!games.length) throw new Error("MLB Pirates schedule parse returned 0 games");

  games.sort((a, b) => {
    const ta = a.strTimestamp && a.strTimestamp !== "TBD" ? new Date(a.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.strTimestamp && b.strTimestamp !== "TBD" ? new Date(b.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });

  return games;
}

const TEAM_IDS = {
  steelers:"134925",
  pirates:"135277",
  penguins:"134844",
  pittpanthers:"136941",
  riverhounds:"138896"
};

const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader("Content-Type","application/json");

  try{
    const teamKey = (req.query.team||"").toLowerCase();
    const TEAM_ID = TEAM_IDS[teamKey];
    if(!TEAM_ID) return res.status(400).json({error:"Unknown team"});

    const now = Date.now();
    if(cache[teamKey] && now - cache[teamKey].ts < CACHE_TTL){
      return res.status(200).send(cache[teamKey].body);
    }

    let lastGames = [];
    let nextGames = [];

    if (teamKey === "steelers") {
      try {
        const steelersGames = await fetchSteelersGamesFromSite();
        const nowMs = Date.now();
        const dated = steelersGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || (item.g.intHomeScore != null && item.g.intAwayScore != null))
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs)
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);

        // Keep TBD games available as upcoming when dates are not finalized.
        const tbdGames = steelersGames.filter(g => g.strTimestamp === "TBD");
        nextGames = [...nextGames, ...tbdGames];
      } catch (e) {
        console.warn("Steelers.com source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (teamKey === "pittpanthers") {
      try {
        const panthersGames = await fetchPittPanthersGamesFromSite();
        const nowMs = Date.now();
        const dated = panthersGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || item.g.strStatus === "FT" || item.g.strStatus === "LIVE")
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs && item.g.strStatus !== "FT")
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);

        const tbdGames = panthersGames.filter(g => g.strTimestamp === "TBD");
        nextGames = [...nextGames, ...tbdGames];
      } catch (e) {
        console.warn("PittsburghPanthers.com source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (teamKey === "penguins") {
      try {
        const penguinsGames = await fetchPenguinsGamesFromNhlSite();
        const nowMs = Date.now();
        const dated = penguinsGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || item.g.strStatus === "FT" || item.g.strStatus === "LIVE")
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs && item.g.strStatus !== "FT")
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);
      } catch (e) {
        console.warn("NHL Penguins source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (teamKey === "pirates") {
      try {
        const piratesGames = await fetchPiratesGamesFromMlbSite();
        const nowMs = Date.now();
        const dated = piratesGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || item.g.strStatus === "FT" || item.g.strStatus === "LIVE")
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs && item.g.strStatus !== "FT")
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);
      } catch (e) {
        console.warn("MLB Pirates source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (teamKey === "riverhounds") {
      try {
        const siteGames = await fetchRiverhoundsGamesFromSite();
        let mergedGames = siteGames;

        try {
          const lastRes = await fetch(`${API_BASE}/eventslast.php?id=${TEAM_ID}`);
          const lastJson = await lastRes.json();
          const nextRes = await fetch(`${API_BASE}/eventsnext.php?id=${TEAM_ID}`);
          const nextJson = await nextRes.json();
          const dbGames = [...(lastJson?.results || []), ...(nextJson?.events || [])].map(g => ({
            dateEvent: g.dateEvent || null,
            strTimestamp: g.strTimestamp || null,
            strStatus: g.strStatus || (g.intHomeScore != null && g.intAwayScore != null ? "FT" : "NS"),
            strHomeTeam: g.strHomeTeam,
            strAwayTeam: g.strAwayTeam,
            intHomeScore: g.intHomeScore != null ? Number(g.intHomeScore) : null,
            intAwayScore: g.intAwayScore != null ? Number(g.intAwayScore) : null
          }));
          mergedGames = mergeRiverhoundsScores(siteGames, dbGames);
        } catch (mergeErr) {
          console.warn("Riverhounds score merge fallback failed:", mergeErr.message || mergeErr);
        }

        const nowMs = Date.now();
        const dated = mergedGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || item.g.strStatus === "FT" || item.g.strStatus === "LIVE")
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs && item.g.strStatus !== "FT")
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);
      } catch (e) {
        console.warn("Riverhounds.com source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (!lastGames.length && !nextGames.length) {
      const lastRes = await fetch(`${API_BASE}/eventslast.php?id=${TEAM_ID}`);
      const lastJson = await lastRes.json();
      lastGames = lastJson?.results || [];

      const nextRes = await fetch(`${API_BASE}/eventsnext.php?id=${TEAM_ID}`);
      const nextJson = await nextRes.json();
      nextGames = nextJson?.events || [];
    }

    const nowISO = new Date().toISOString();
    let currentGame = null;

    // Check last games
    for(const g of lastGames){
      if(!g.dateEvent || !g.strTime) continue;
      const start = new Date(`${g.dateEvent}T${g.strTime}`).toISOString();
      const end = g.strTimeEnd?new Date(`${g.dateEvent}T${g.strTimeEnd}`).toISOString():new Date(new Date(`${g.dateEvent}T${g.strTime}`).getTime() + 3*60*60*1000).toISOString(); // default 3h
      if(start<=nowISO && nowISO<=end){
        currentGame = formatGame(g,false,teamKey);
        break;
      }
    }

    // Check next games if no live game
    if(!currentGame){
      for(const g of nextGames){
        if(!g.dateEvent || !g.strTime) continue;
        const start = new Date(`${g.dateEvent}T${g.strTime}`).toISOString();
        const end = g.strTimeEnd?new Date(`${g.dateEvent}T${g.strTimeEnd}`).toISOString():new Date(new Date(`${g.dateEvent}T${g.strTime}`).getTime() + 3*60*60*1000).toISOString();
        if(start<=nowISO && nowISO<=end){
          currentGame = formatGame(g,true,teamKey);
          break;
        }
      }
    }

    const lastFormatted = lastGames.map(g => formatGame(g, false, teamKey));
    const nextFormatted = nextGames.map(g => formatGame(g, true, teamKey));

    const allGamesMap = new Map();
    for (const g of [...lastFormatted, ...nextFormatted]) {
      if (!g) continue;
      const key = g.idEvent || `${g.gameDate}|${g.home?.name}|${g.away?.name}`;
      if (!allGamesMap.has(key)) allGamesMap.set(key, g);
    }
    const allGames = [...allGamesMap.values()].sort((a, b) => {
      const ta = a.gameDate && a.gameDate !== "TBD" ? new Date(a.gameDate).getTime() : Number.MAX_SAFE_INTEGER;
      const tb = b.gameDate && b.gameDate !== "TBD" ? new Date(b.gameDate).getTime() : Number.MAX_SAFE_INTEGER;
      return ta - tb;
    });

    if (!currentGame) {
      const nowMs = Date.now();
      const latestFinished = [...allGames]
        .filter(g => g && g.gameDate && g.gameDate !== "TBD")
        .filter(g => {
          const ms = new Date(g.gameDate).getTime();
          return Number.isFinite(ms) && (ms <= nowMs || g.status === "FT" || g.status === "LIVE");
        })
        .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime())[0];

      currentGame = latestFinished || allGames[0] || null;
    }

    const payload = {
      team:teamKey,
      fetchedAt:new Date().toISOString(),
      latestGame: currentGame,
      nextGame: nextFormatted[0]||null,
      upcomingGames: nextFormatted,
      allGames
    };

    const body = JSON.stringify(payload);
    cache[teamKey] = {ts:now, body};

    return res.status(200).send(body);

  }catch(err){
    console.error(`API Error for team ${req.query.team}:`,err);
    return res.status(500).json({error:"Server Error", details:err.message||String(err)});
  }
}
