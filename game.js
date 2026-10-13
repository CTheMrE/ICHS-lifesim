// ============================================================
// ICHS LifeSim - Year 7 game engine
// Faithful JS port of characters.py / cliques.py / monthcycles.py / yearSeven.py
// ============================================================

const STAT_KEYS = [
  "football","cricket","racket_sports",
  "speed","strength","shape",
  "stem","arts","general",
  "likeability","popularity","humor",
  "obedience","work_ethic","maturity",
  "chess"
];

const CHARACTERS_BASE = [
  ["Aaraadhn","H1",54,77,91,56,53,63,58,53,71,72,80,72,67,70,64,70],
  ["Afzal","H1",49,40,58,45,56,78,55,35,75,82,91,88,42,59,57,50],
  ["Ali","H1",73,95,96,67,84,74,50,45,50,63,62,66,84,76,85,44],
  ["Aryan","H1",70,83,91,49,58,66,56,58,70,68,65,70,81,75,87,60],
  ["Asad","H1",82,83,69,60,72,73,50,38,59,95,93,93,67,85,60,69],
  ["Ashrafi","H1",95,81,84,92,81,80,57,69,72,60,77,70,87,90,74,65],
  ["Athar","H2",91,88,60,85,76,81,74,65,82,62,58,65,90,83,78,66],
  ["Azan","H1",68,60,88,75,91,84,75,70,81,63,61,70,85,83,77,59],
  ["Branavan","H1",53,48,40,45,55,60,50,45,45,67,54,67,74,71,70,90],
  ["Enzo","H1",92,71,58,86,75,82,73,64,83,86,95,85,91,84,79,67],
  ["Haris","E2",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ["Hussain","H1",85,80,67,83,90,86,73,61,62,77,80,75,66,60,68,85],
  ["Janathan","H1",80,60,52,62,86,75,69,60,64,73,73,82,65,62,70,53],
  ["Jumani","F2",57,73,59,74,66,62,73,83,79,74,64,66,85,89,83,68],
  ["Kaiser","H1",92,74,71,80,76,84,49,47,58,79,78,73,59,64,82,80],
  ["Khan","H1",63,50,70,95,93,90,88,70,83,58,45,59,79,72,72,90],
  ["Moko","H1",44,34,79,41,49,44,45,41,42,84,85,89,39,47,47,53],
  ["Munthar","H1",44,28,32,23,57,32,95,79,93,58,48,62,96,95,97,45],
  ["Musa","H1",69,80,74,77,72,70,95,93,92,65,68,72,94,95,91,50],
  ["Nabil","H1",60,88,55,66,64,67,77,73,89,69,56,63,92,86,94,88],
  ["Noname","H1",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ["Prathik","H1",50,95,94,62,55,49,39,33,45,72,67,74,73,69,72,97],
  ["Rahul","H1",76,88,50,69,67,71,52,42,70,70,86,77,49,52,44,75],
  ["Rushil","H1",40,24,65,27,40,30,62,62,52,52,70,54,88,93,78,70],
  ["Ryaan","H1",54,64,82,53,92,84,60,59,61,62,58,65,80,80,68,48],
  ["Shah","H1",39,93,90,14,42,55,94,90,94,59,72,68,94,96,92,68],
  ["Sharafat","H1",84,54,37,18,83,35,48,41,51,90,95,90,44,54,50,40],
  ["Shayan","F1",50,60,66,74,90,90,88,89,80,58,45,57,79,72,72,80],
  ["Shikder","H1",55,44,76,16,89,38,76,73,85,79,88,90,53,57,55,84],
  ["Taimoor","H1",82,48,44,65,71,77,42,34,49,85,75,89,52,49,53,30],
  ["Tazim","H1",74,90,59,32,65,30,71,68,77,55,89,70,55,65,32,36],
  ["Umar","H1",95,75,61,95,95,93,77,77,88,88,78,79,66,66,60,93],
  ["Yunus","H1",76,64,86,62,59,70,54,48,55,93,96,86,34,59,42,73],
  ["Zayyan","H1",86,69,57,72,77,84,65,65,69,80,77,78,70,69,66,72],
];

function makeCharacters(){
  return CHARACTERS_BASE.map(row => {
    const [name, form, ...vals] = row;
    const c = { name, form };
    STAT_KEYS.forEach((k,i) => c[k] = vals[i]);
    deriveStats(c);
    return c;
  });
}

// ---------- helpers ----------
function randInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); } // inclusive both ends (like Python randint)
function randRange(a,b){ return a + Math.floor(Math.random()*(b-a)); } // like Python randrange(a,b), exclusive of b
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function deriveStats(c){
  c.sports = Math.floor((c.football + c.cricket + c.racket_sports)/3);
  c.fitness = Math.floor((c.speed + c.strength + c.shape)/3);
  c.intelligence = Math.floor((c.stem + c.arts + c.general)/3);
  c.social = Math.floor((c.likeability + c.popularity + c.humor)/3);
  c.behaviour = Math.floor((c.obedience + c.work_ethic + c.maturity)/3);
}

function clampStat(c,k){
  if (c[k] > 100) c[k] = 100;
  if (c[k] < 0) c[k] = 0;
}
function clampAll(c){ STAT_KEYS.forEach(k => clampStat(c,k)); }

// ============================================================
// CLIQUES (from cliques.py)
// ============================================================
var CLIQUE_DEFS = [
  { id:"football",  label:"Football clique",   check:c=>c.football>=90,
    deltas:{football:[3,3],cricket:[1,1],racket_sports:[1,1],speed:[2,2],strength:[1,1],shape:[3,3],stem:[-1,-1],arts:[-2,-2],general:[1,1],likeability:[1,1],popularity:[2,2],humor:[1,1],obedience:[-1,-1],work_ethic:[1,1],maturity:[-2,-2],chess:[-2,-2]} },
  { id:"sporty",    label:"Sporty clique",     check:c=>c.sports>=90,
    deltas:{football:[2,2],cricket:[2,2],racket_sports:[2,2],speed:[2,2],strength:[2,2],shape:[2,2],stem:[-2,-2],arts:[-2,-2],general:[2,2],likeability:[2,2],popularity:[1,1],humor:[1,1],obedience:[-2,-2],work_ethic:[2,2],maturity:[-1,-1],chess:[-2,-2]} },
  { id:"brains",    label:"Brains clique",     check:c=>c.intelligence>=90,
    deltas:{football:[-2,-2],cricket:[-2,-2],racket_sports:[0,0],speed:[-2,-2],strength:[-1,-1],shape:[-1,-1],stem:[5,5],arts:[3,3],general:[1,1],likeability:[-2,-2],popularity:[-3,-3],humor:[-2,-2],obedience:[2,2],work_ethic:[4,4],maturity:[4,4],chess:[1,1]} },
  { id:"chess",     label:"Chess clique",      check:c=>c.chess>=85,
    deltas:{football:[-1,-1],cricket:[-1,-1],racket_sports:[-1,-1],speed:[-1,-1],strength:[-2,-2],shape:[-1,-1],stem:[2,2],arts:[3,3],general:[3,3],likeability:[-2,-2],popularity:[-2,-2],humor:[1,1],obedience:[2,2],work_ethic:[2,2],maturity:[3,3],chess:[3,3]} },
  { id:"social",    label:"Social clique",     check:c=>c.social>=90,
    deltas:{football:[1,1],cricket:[0,0],racket_sports:[0,0],speed:[0,0],strength:[0,0],shape:[2,2],stem:[-1,-1],arts:[-2,-2],general:[1,1],likeability:[3,3],popularity:[3,3],humor:[2,2],obedience:[-1,-1],work_ethic:[-1,-1],maturity:[-2,-2],chess:[-2,-2]} },
  { id:"behaved",   label:"Behaved clique",    check:c=>c.behaviour>=90,
    deltas:{football:[-2,-2],cricket:[-1,-1],racket_sports:[-1,-1],speed:[-2,-2],strength:[-2,-2],shape:[-1,-1],stem:[2,2],arts:[3,3],general:[-1,-1],likeability:[-3,-3],popularity:[-3,-3],humor:[-3,-3],obedience:[6,6],work_ethic:[3,3],maturity:[5,5],chess:[1,1]} },
  { id:"troublesome",label:"Troublesome clique",check:c=>c.behaviour<=50,
    deltas:{football:[-2,-2],cricket:[-1,-1],racket_sports:[-2,-2],speed:[0,0],strength:[1,1],shape:[2,2],stem:[-3,-3],arts:[-4,-4],general:[1,1],likeability:[2,2],popularity:[5,5],humor:[3,3],obedience:[-4,-4],work_ethic:[-4,-4],maturity:[-4,-4],chess:[-3,-3]} },
  { id:"losers",    label:"Losers clique",     check:c=>c.social<=65,
    deltas:{football:[-2,-2],cricket:[-2,-2],racket_sports:[-1,-1],speed:[-3,-3],strength:[-2,-2],shape:[-3,-3],stem:[3,3],arts:[2,2],general:[-2,-2],likeability:[-4,-4],popularity:[-3,-3],humor:[-1,-1],obedience:[3,3],work_ethic:[3,3],maturity:[3,3],chess:[1,1]} },
  { id:"cricket",   label:"Cricket clique",    check:c=>c.cricket>=90,
    deltas:{football:[1,1],cricket:[3,3],racket_sports:[2,2],speed:[1,1],strength:[2,2],shape:[2,2],stem:[-1,-1],arts:[-1,-1],general:[0,0],likeability:[1,1],popularity:[1,1],humor:[0,0],obedience:[-1,-1],work_ethic:[1,1],maturity:[-1,-1],chess:[-2,-2]} },
  { id:"nonchalant",label:"Nonchalant clique", check:c=>c.work_ethic<=70,
    deltas:{football:[1,1],cricket:[0,0],racket_sports:[0,0],speed:[-1,-1],strength:[-1,-1],shape:[1,1],stem:[0,0],arts:[-1,-1],general:[1,1],likeability:[3,3],popularity:[1,1],humor:[2,2],obedience:[-1,-1],work_ethic:[-2,-2],maturity:[1,1],chess:[-1,-1]} },
  { id:"gym",       label:"Gym clique",        check:c=>c.strength>=87,
    deltas:{football:[0,0],cricket:[0,0],racket_sports:[1,1],speed:[1,1],strength:[3,3],shape:[2,2],stem:[0,0],arts:[-1,-1],general:[0,0],likeability:[1,1],popularity:[1,1],humor:[0,0],obedience:[-1,-1],work_ethic:[3,3],maturity:[-1,-1],chess:[-1,-1]} },
  { id:"jokemen",   label:"Jokemen clique",    check:c=>c.humor>=90,
    deltas:{football:[0,0],cricket:[-1,-1],racket_sports:[-1,-1],speed:[1,1],strength:[1,1],shape:[2,2],stem:[-2,-2],arts:[-3,-3],general:[1,1],likeability:[2,2],popularity:[3,3],humor:[4,4],obedience:[-2,-2],work_ethic:[-3,-3],maturity:[-4,-4],chess:[-2,-2]} },
];

function applyDeltas(c, deltas){
  const log = [];
  for (const k of Object.keys(deltas)){
    const [a,b] = deltas[k];
    const amt = (a===b) ? a : randInt(Math.min(a,b), Math.max(a,b));
    c[k] += amt;
  }
  clampAll(c);
  deriveStats(c);
}

function availableCliques(c){
  return CLIQUE_DEFS.filter(cl => cl.check(c));
}

// ============================================================
// MONTH CYCLE (from monthcycles.py)
// ============================================================
function statUpdateMonthly(chosen, others){
  chosen.football += 1; chosen.cricket += 1; chosen.racket_sports += 1;
  chosen.speed += 1; chosen.strength += 1; chosen.shape += 1;
  chosen.stem += 1; chosen.arts += 1; chosen.general += 1;
  chosen.likeability += 1; chosen.popularity += 1; chosen.humor += 1;
  chosen.obedience -= 1; chosen.work_ethic -= 1; chosen.maturity += 1;
  chosen.chess += 1;

  for (const char of others){
    if (char === chosen) continue;
    if (Math.random() < 0.5) char.football += 1;
    if (Math.random() < 0.5) char.cricket += 1;
    if (Math.random() < 0.5) char.racket_sports += 1;
    if (Math.random() < 0.5) char.speed += 1;
    if (Math.random() < 0.5) char.strength += 1;
    if (Math.random() < 0.5) char.shape += 1;
    if (Math.random() < 0.5) char.stem += 1;
    if (Math.random() < 0.5) char.arts += 1;
    if (Math.random() < 0.5) char.general += 1;
    if (Math.random() < 0.5) char.likeability += 1;
    if (Math.random() < 0.5) char.popularity += 1;
    if (Math.random() < 0.5) char.humor += 1;
    if (Math.random() < 0.8) char.obedience -= 1;
    if (Math.random() < 0.5) char.work_ethic += 1;
    if (Math.random() < 0.5) char.maturity += 1;
    if (Math.random() < 0.5) char.chess += 1;
    clampAll(char);
    deriveStats(char);
  }
}

function detChance(state){
  const detcheck0 = 100 - state.chosen.behaviour;
  const chance = detcheck0 / 100.0;
  let before = 0;
  if (Math.random() < chance){
    let detcheck = detcheck0 < 15 ? 15 : detcheck0;
    before = randInt(1, Math.max(1, Math.floor(detcheck/15)));
  }
  state.detentions += before;
  return before;
}

// One full "changeMonth()" cycle: stat drift + clamp + detention chance + clique bonus
function changeMonth(state){
  statUpdateMonthly(state.chosen, state.characters);
  clampAll(state.chosen);
  deriveStats(state.chosen);
  const newDets = detChance(state);
  if (state.cliqueBonus) applyDeltas(state.chosen, state.cliqueBonus);
  return { newDets };
}

function skipAll(c, amount){
  STAT_KEYS.forEach(k => { c[k] -= amount; clampStat(c,k); });
  deriveStats(c);
}



// ============================================================
// Year 7 months - faithful port of yearSeven.py
// Each month: { date, clublist, prompt, skip:{label,penalty} | null, options:[{key,label,run(c,state)->{log,detDelta}}] }
// run() mutates c in place and returns an array of log lines (result text)
// ============================================================

function applySkip(c, state){
  const amt = state.skip;
  const keys = ["football","cricket","racket_sports","speed","strength","shape","stem","arts","general","likeability","popularity","humor","obedience","work_ethic","maturity","chess"];
  keys.forEach(k => { c[k] -= amt; if(c[k]<0)c[k]=0; if(c[k]>100)c[k]=100; });
  deriveStats(c);
  state.skip += 1;
  return ["You have decided to skip."];
}

var MONTHS = [];

// ---------------- Month 1 : September 2021 ----------------
MONTHS.push({
  date: "September, 2021",
  clublist: [],
  prompt: "You have the opportunity to try out for a school team. Which team will you try out for?",
  options: [
    { key:"f", label:"Football tryout", run:(c,state)=>{
      let log;
      if (c.football >= 90){
        log = [pick([
          "YOU SCORED A HATTRICK! Welcome to the team.",
          "Good performance, you played well. You are in the team",
          "You got lucky, but fair play. You're in the team"
        ])];
        c.football+=randInt(3,5); c.cricket+=randInt(1,3); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(3,5); c.strength+=randInt(2,4); c.shape+=randInt(2,4);
        c.stem-=randInt(1,3); c.arts-=randInt(2,4); c.general+=randInt(1,3);
        c.likeability+=randInt(2,4); c.popularity+=randInt(4,6); c.humor+=randInt(2,4);
        c.obedience-=randInt(2,4); c.work_ethic+=randInt(2,4); c.maturity+=randInt(1,3);
        c.chess-=randInt(3,5);
      } else {
        log = [pick([
          "YOU SCORED A HATTRICK...of own goals. You're not in the team.",
          "How'd you miss that open goal! You're not in the team",
          "You forgot you were meant to try out for the football team. You're not in the team"
        ])];
        c.football-=randInt(3,5); c.cricket-=randInt(1,3); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(3,5); c.strength-=randInt(2,4); c.shape-=randInt(2,4);
        c.stem-=randInt(2,4); c.arts-=randInt(2,4); c.general-=randInt(1,3);
        c.likeability-=randInt(2,4); c.popularity-=randInt(2,4); c.humor-=randInt(2,4);
        c.obedience-=randInt(3,4); c.work_ethic-=randInt(2,4); c.maturity-=randInt(1,3);
        c.chess-=randInt(4,5);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"c", label:"Cricket tryout", run:(c,state)=>{
      let log;
      if (c.cricket >= 90){
        log = [pick([
          "You smashed it! Welcome to the cricket team.",
          "You're very lucky you only played bad people, but congrats on making the team!",
          "You played decent and got into the team!"
        ])];
        c.football+=randInt(1,2); c.cricket+=randInt(3,5); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(2,4); c.strength+=randInt(2,3); c.shape+=randInt(2,3);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general+=randInt(1,2);
        c.likeability+=randInt(2,4); c.popularity+=randInt(2,4); c.humor+=randInt(2,3);
        c.obedience-=randInt(1,2); c.work_ethic+=randInt(2,4); c.maturity+=randInt(1,3);
        c.chess-=randInt(2,3);
      } else {
        log = [pick([
          "You had tough competition. You're not in the team.",
          "You made a HUGE mistake right in front of Sir! You're not in the team",
          "You forgot you were meant to try out. You're not in the team"
        ])];
        c.football-=randInt(1,2); c.cricket-=randInt(3,5); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(2,4); c.strength-=randInt(2,3); c.shape-=randInt(2,3);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(2,4); c.popularity-=randInt(2,3); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"r", label:"Racket sports tryout", run:(c,state)=>{
      let log;
      if (c.racket_sports >= 85){
        log = [pick([
          "You won everything! Welcome to the team",
          "You're very lucky you only played bad people, but congrats on making the team!",
          "You played decent and got into the team!"
        ])];
        c.football+=randInt(1,2); c.cricket+=randInt(2,3); c.racket_sports+=randInt(3,5);
        c.speed+=randInt(3,5); c.strength+=randInt(2,4); c.shape+=randInt(2,4);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general+=randInt(1,2);
        c.likeability+=randInt(2,4); c.popularity+=randInt(2,4); c.humor+=randInt(2,3);
        c.obedience-=randInt(1,2); c.work_ethic+=randInt(2,4); c.maturity+=randInt(1,3);
        c.chess-=randInt(2,3);
      } else {
        log = [pick([
          "You had tough competition. You're not in the team.",
          "You made a HUGE mistake right in front of Sir! You're not in the team",
          "You forgot you were meant to try out. You're not in the team"
        ])];
        c.football-=randInt(1,2); c.cricket-=randInt(2,3); c.racket_sports-=randInt(3,5);
        c.speed-=randInt(3,5); c.strength-=randInt(2,4); c.shape-=randInt(2,4);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(2,3); c.popularity-=randInt(2,3); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"b", label:"Chess tryout", run:(c,state)=>{
      let log;
      if (c.chess >= 80){
        log = [pick([
          "You won everything! Welcome to the team",
          "You're very lucky you only played bad people, but congrats on making the team",
          "Your opponents didn't show up. Well done, you're in the team."
        ])];
        c.football-=randInt(2,3); c.cricket-=randInt(2,3); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(2,4); c.strength-=randInt(2,4); c.shape-=randInt(1,3);
        c.stem+=randInt(3,5); c.arts+=randInt(2,4); c.general+=randInt(3,5);
        c.likeability+=randInt(1,3); c.popularity+=randInt(1,2); c.humor+=randInt(1,2);
        c.obedience+=randInt(3,5); c.work_ethic+=randInt(3,5); c.maturity+=randInt(2,4);
        c.chess+=randInt(5,7);
      } else {
        log = [pick([
          "You won a few games but had some hard fixtures. You didn't qualify for the team",
          "You blundered your queen and blundered your spot in the chess team.",
          "How did you forget you had a match? You didn't qualify."
        ])];
        c.football-=randInt(2,3); c.cricket-=randInt(2,3); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(2,3); c.strength-=randInt(2,3); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(1,3); c.popularity-=randInt(1,3); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(2,4);
      }
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip: true,
});

// ---------------- Month 2 : October 2021 ----------------
MONTHS.push({
  date: "October, 2021",
  clublist: ["Maths","Latin"],
  prompt: "You have the opportunity to run for a student role. What will you run for?",
  options: [
    { key:"s", label:"Run for sports captain", run:(c)=>{
      let log;
      const win = (c.sports>=85 && c.social>=85 && c.cricket>=75) || c.football>=95 || (c.social>=95 && c.football>=85);
      if (win){
        log=[pick(["Everyone voted for you, you're now sports captain","Well done, you got majority votes. You are now sports captain.","Your opposition didn't turn up, so you're sports captain."])];
        c.football+=randInt(3,6); c.cricket+=randInt(2,4); c.racket_sports+=randInt(2,4);
        c.speed+=randInt(2,4); c.strength+=randInt(2,3); c.shape+=randInt(2,3);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general+=randInt(1,2);
        c.likeability+=randInt(2,4); c.popularity+=randInt(3,6); c.humor+=randInt(2,4);
        c.obedience+=randInt(1,3); c.work_ethic+=randInt(2,4); c.maturity+=randInt(1,2);
        c.chess-=randInt(1,3);
      } else {
        log=[pick(["You lost by 1 vote, unlucky. You aren't sports captain.","Nobody voted for you. You are not sports captain.","You didn't write a speech, you aren't sports captain."])];
        c.football-=randInt(2,4); c.cricket-=randInt(1,3); c.racket_sports-=randInt(1,3);
        c.speed-=randInt(2,3); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(2,4); c.popularity-=randInt(2,3); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"f", label:"Run for form captain", run:(c)=>{
      let log;
      const win = (c.intelligence>=85 && c.social>=80) || c.social>=90;
      if (win){
        log=[pick(["Everyone voted for you, you're now form captain","Well done, you got majority votes. You are now form captain.","Your opposition didn't turn up, so you're form captain."])];
        c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem+=randInt(2,4); c.arts+=randInt(2,3); c.general+=randInt(2,4);
        c.likeability+=randInt(2,3); c.popularity+=randInt(2,3); c.humor+=randInt(1,2);
        c.obedience+=randInt(3,5); c.work_ethic+=randInt(3,5); c.maturity+=randInt(2,4);
        c.chess+=randInt(1,3);
      } else {
        log=[pick(["You lost by 1 vote, unlucky. You aren't form captain.","Nobody voted for you. You are not form captain.","You didn't write a speech, you aren't form captain."])];
        c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(1,2); c.popularity-=randInt(1,2); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:true,
});

// ---------------- Month 3 : November 2021 ----------------
MONTHS.push({
  date: "November, 2021",
  clublist: ["Maths","Chess","Latin","Cooking","Japanese","Badminton","Table tennis","Warhammer"],
  prompt: "You didn't do your physics homework and the teacher is checking. What will you do?",
  options: [
    { key:"q", label:"Try to do it in class, quickly", run:(c,state)=>{
      let log; const chance = randRange(1,10);
      if (chance<=4){
        log=[pick(["You're lucky, did it just in time. You didn't get a detention.","Well done, very fast and you fooled Miss. You didn't get a detention.","Close call, but you got away with it. No detention this time."])];
        c.football+=randInt(0,2); c.cricket+=randInt(0,2); c.racket_sports+=randInt(0,2);
        c.speed+=randInt(1,3); c.strength+=randInt(0,2); c.shape+=randInt(0,2);
        c.stem-=randInt(2,4); c.arts-=randInt(1,2); c.general-=randInt(1,3);
        c.likeability+=randInt(1,3); c.popularity+=randInt(1,2); c.humor+=randInt(1,2);
        c.obedience-=randInt(2,3); c.work_ethic-=randInt(1,3); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
      } else {
        log=[pick(["Your partner didn't let you copy him. You got a detention.","Too slow! You got a detention.","Bad luck, she checked you early. You have a detention."])];
        c.football-=randInt(0,2); c.cricket-=randInt(0,2); c.racket_sports-=randInt(0,2);
        c.speed-=randInt(1,2); c.strength-=randInt(0,2); c.shape-=randInt(0,2);
        c.stem-=randInt(3,5); c.arts-=randInt(1,3); c.general-=randInt(2,4);
        c.likeability-=randInt(1,2); c.popularity-=randInt(1,2); c.humor+=randInt(1,2);
        c.obedience-=randInt(2,4); c.work_ethic-=randInt(2,4); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
        state.detentions += 1;
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"t", label:"Tell her you were too busy with other homework", run:(c,state)=>{
      let log; const chance = randRange(1,10);
      if (chance>3){
        log=[pick(["She gave you an extension. You didn't get a detention.","She felt kind. You don't have a detention.","She let you off. No detention this time."])];
        c.football-=randInt(0,2); c.cricket-=randInt(0,2); c.racket_sports-=randInt(0,2);
        c.speed-=randInt(0,2); c.strength-=randInt(0,2); c.shape-=randInt(0,2);
        c.stem-=randInt(1,3); c.arts-=randInt(0,2); c.general-=randInt(1,3);
        c.likeability-=randInt(1,2); c.popularity-=randInt(1,2); c.humor-=randInt(1,2);
        c.obedience+=randInt(3,5); c.work_ethic+=randInt(2,4); c.maturity+=randInt(2,4);
        c.chess+=randInt(1,2);
      } else {
        log=[pick(["She didn't care. You have a detention.","Tough luck. She gave you the detention.","She gave you an extension, but you forgot to do it. Detention!"])];
        c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(0,2); c.shape-=randInt(0,2);
        c.stem-=randInt(2,4); c.arts-=randInt(1,2); c.general-=randInt(2,3);
        c.likeability-=randInt(1,2); c.popularity-=randInt(1,2); c.humor-=randInt(0,1);
        c.obedience+=randInt(1,3); c.work_ethic-=randInt(1,2); c.maturity+=randInt(1,2);
        c.chess-=randInt(1,2);
        state.detentions += 1;
      }
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 4 : December 2021 ----------------
MONTHS.push({
  date: "December, 2021",
  clublist: ["Latin","Cooking","Chess","Japanese","Badminton","Table tennis","Warhammer"],
  prompt: "It's Christmas time and there are some interhouse competitions going on. Which will you enter?",
  options: [
    { key:"s", label:"Sports competition", run:(c)=>{
      let log;
      if (c.football>=85 || c.cricket>=85 || c.racket_sports>=80){
        log=[pick(["You carried your team and won the tournament. Well done!","Solid performance, congrats on your win!","You got lucky, but fair play. You won the tournament!"])];
        c.football+=randInt(3,6); c.cricket+=randInt(2,4); c.racket_sports+=randInt(2,4);
        c.speed+=randInt(2,4); c.strength+=randInt(2,3); c.shape+=randInt(2,3);
        c.stem-=randInt(2,3); c.arts-=randInt(1,2); c.general+=randInt(1,2);
        c.likeability+=randInt(3,5); c.popularity+=randInt(4,6); c.humor+=randInt(2,3);
        c.obedience-=randInt(1,3); c.work_ethic+=randInt(1,3); c.maturity+=randInt(1,2);
        c.chess-=randInt(2,3);
      } else {
        log=[pick(["You played decent, but still lost. Unlucky!","You made quite a few mistakes and lost.","You flopped it. You lost the tournament."])];
        c.football-=randInt(2,4); c.cricket-=randInt(1,3); c.racket_sports-=randInt(2,3);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability-=randInt(2,3); c.popularity-=randInt(2,4); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"m", label:"Maths tournament", run:(c)=>{
      let log;
      if (c.stem>=85){
        log=[pick(["You carried your team. You won the competition!","You're very lucky, but your team still won!","Solid performance, your team won!"])];
        c.football-=randInt(2,3); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem+=randInt(3,5); c.arts+=randInt(2,3); c.general+=randInt(3,5);
        c.likeability+=randInt(1,3); c.popularity+=randInt(1,3); c.humor+=randInt(1,2);
        c.obedience+=randInt(3,5); c.work_ethic+=randInt(2,4); c.maturity+=randInt(2,4);
        c.chess+=randInt(2,3);
      } else {
        log=[pick(["You played ok but ended up losing. Unlucky!","You made quite a few mistakes and lost.","You flopped it. You lost the tournament."])];
        c.football-=randInt(2,3); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(2,4); c.arts-=randInt(1,2); c.general-=randInt(2,3);
        c.likeability-=randInt(1,2); c.popularity-=randInt(1,2); c.humor-=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:true,
});

// ---------------- Month 5 : January 2022 ----------------
MONTHS.push({
  date: "January, 2022",
  clublist: ["Chess"],
  prompt: "Happy New Year! Your maths teacher is absent and you have a substitute. What will you do?",
  options: [
    { key:"m", label:"Mess around", run:(c,state)=>{
      let log;
      if (c.behaviour<70){
        log=[pick(["Tough sub! She gave you a det!","Pushed your luck, you got a det!","The sub told your teacher. That's a det!"])];
        c.football+=randInt(1,2); c.cricket+=randInt(1,2); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(2,3); c.arts-=randInt(1,2); c.general-=randInt(2,3);
        c.likeability+=randInt(2,3); c.popularity+=randInt(3,4); c.humor+=randInt(2,3);
        c.obedience-=randInt(2,3); c.work_ethic-=randInt(1,2); c.maturity-=randInt(2,3);
        c.chess-=randInt(1,2);
        state.detentions += 1;
      } else {
        log=[pick(["Miss could not care less.","Lucky guy! How'd miss not catch you throw the pen at her!","You didn't get any det! How?"])];
        c.football+=randInt(1,2); c.cricket+=randInt(1,2); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability+=randInt(1,2); c.popularity+=randInt(2,3); c.humor+=randInt(2,3);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"t", label:"Talk, chill and do some work", run:(c,state)=>{
      let log;
      if (c.intelligence<70 || c.behaviour<60){
        log=[pick(["Harsh Sub. She actually gave you a det!","Too many people were also talking and everyone got a det including YOU","The Sub gave your name to your teacher. You got a det!"])];
        c.football+=randInt(1,2); c.cricket+=randInt(1,2); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability+=randInt(2,3); c.popularity+=randInt(1,3); c.humor+=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
        state.detentions += 1;
      } else {
        log=[pick(["Miss couldn't care less!","At least you did the work!","You did not get caught. Fair play!"])];
        c.football+=randInt(1,2); c.cricket+=randInt(1,2); c.racket_sports+=randInt(1,2);
        c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.likeability+=randInt(1,2); c.popularity+=randInt(1,2); c.humor+=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.chess-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"w", label:"Be silent and finish everything", run:(c)=>{
      const log=[pick(["Nerd...","A bit lame, but you do you!","The sub really liked you. Suck up!"])];
      c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
      c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      c.stem+=randInt(4,5); c.arts+=randInt(3,4); c.general+=randInt(3,4);
      c.likeability-=randInt(2,4); c.popularity-=randInt(3,5); c.humor-=randInt(2,3);
      c.obedience+=randInt(3,5); c.work_ethic+=randInt(4,6); c.maturity+=randInt(4,6);
      c.chess+=randInt(1,2);
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 6 : February 2022 ----------------
MONTHS.push({
  date: "February, 2022",
  clublist: ["Latin","Japanese","Badminton","Warhammer","Chess"],
  prompt: "Oh No! Your friends are bullying one of your classmates. They took his water bottle and it's ended up in your hands. What will you do?",
  options: [
    { key:"b", label:"Taunt him with the bottle", run:(c,state)=>{
      const log=[pick(["Too far. He reported you and you're in BIG trouble.","Well...that didn't go to plan. He reported you.","A teacher caught you and now you're in BIG trouble."])];
      c.football-=randInt(3,5); c.cricket-=randInt(2,4); c.racket_sports-=randInt(2,3);
      c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      c.stem-=randInt(2,3); c.arts-=randInt(2,3); c.general-=randInt(2,3);
      c.likeability+=randInt(3,5); c.popularity+=randInt(4,6); c.humor+=randInt(1,2);
      c.obedience-=randInt(3,5); c.work_ethic-=randInt(2,3); c.maturity-=randInt(2,4);
      c.chess-=randInt(2,3);
      state.detentions += randInt(3,6);
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"g", label:"Give it to someone else", run:(c,state)=>{
      let log;
      if (c.behaviour<=70){
        log=[pick(["The bullies got reported and you too were in some trouble!","You got ratted out. You're in trouble.","A teacher caught you and you're in trouble!"])];
        c.football-=randInt(2,3); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
        c.stem-=randInt(2,3); c.arts-=randInt(2,3); c.general-=randInt(2,3);
        c.likeability+=randInt(1,3); c.popularity+=randInt(2,4); c.humor+=randInt(1,2);
        c.obedience-=randInt(2,4); c.work_ethic-=randInt(1,2); c.maturity-=randInt(2,3);
        c.chess-=randInt(1,2);
        state.detentions += 2;
      } else {
        log=[pick(["They got reported but you weren't involved.","The person you passed it to gave the bottle back, so you didn't get in trouble.","You didn't get caught!"])];
        c.likeability+=randInt(1,2); c.popularity+=randInt(1,3);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.stem-=randInt(1,2); c.general-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"h", label:"Hand it back to him", run:(c)=>{
      const log=[pick(["The guy was thankful but your friends were not!","You gave it back and your friends were a bit annoyed. The guy thanked you though."])];
      c.football-=randInt(2,3); c.cricket-=randInt(2,3); c.racket_sports-=randInt(2,3);
      c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      c.stem+=randInt(2,3); c.arts+=randInt(1,2); c.general+=randInt(2,3);
      c.likeability-=randInt(2,4); c.popularity-=randInt(3,5); c.humor-=randInt(1,2);
      c.obedience+=randInt(2,4); c.work_ethic+=randInt(2,3); c.maturity+=randInt(2,3);
      c.chess+=randInt(1,2);
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"r", label:"Report your friends", run:(c)=>{
      const log=["Well...Everyone hates you now."];
      c.football-=randInt(3,4); c.cricket-=randInt(2,3); c.racket_sports-=randInt(2,3);
      c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      c.stem+=randInt(3,5); c.arts+=randInt(2,3); c.general+=randInt(3,5);
      c.likeability-=randInt(3,5); c.popularity-=randInt(6,8); c.humor-=randInt(2,3);
      c.obedience+=randInt(4,6); c.work_ethic+=randInt(3,4); c.maturity+=randInt(4,5);
      c.chess+=randInt(1,2);
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 8 : April 2022 ----------------
MONTHS.push({
  date: "April, 2022",
  clublist: ["Maths","Latin","Cooking","Japanese","Badminton","Athletics","Writing","Chess"],
  prompt: "There's 2 days left of the Easter Holidays, but your Chemistry teacher has set 6 hours of homework! Your friends asked you to go out. What will you do?",
  options: [
    { key:"g", label:"Go out with them, delay the homework", run:(c,state)=>{
      let log;
      if (c.general>=80){
        log=[pick(["Crammed it in last minute, but you got it done!","You had fun, came home, and did the homework just fine.","Squeezed it in, but at least you did it!"])];
        c.likeability+=randInt(1,2); c.popularity+=randInt(2,4);
        c.behaviour-=randInt(1,2); c.obedience-=randInt(1,2); c.maturity+=randInt(1,2);
        c.stem+=randInt(1,2); c.general+=randInt(1,3);
      } else {
        log=[pick(["You had fun... but also an hour det. Worth it?","You dummy! You forgot to do the HW!!"])];
        c.likeability+=randInt(2,3); c.popularity+=randInt(3,5);
        c.behaviour-=randInt(2,4); c.obedience-=randInt(2,3); c.maturity-=randInt(1,2);
        c.stem-=randInt(2,3); c.general-=randInt(2,3);
        state.detentions += 2;
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"q", label:"Copy half the homework from the mark scheme, then go", run:(c,state)=>{
      let log;
      if (c.behaviour>=85){
        log=[pick(["You got away with doing half!","You're very lucky sir barely checked.","Sir said you did enough! Lucky!"])];
        c.likeability+=randInt(1,2); c.popularity+=randInt(1,3);
        c.behaviour-=randInt(1,2); c.obedience-=randInt(1,2);
        c.general+=randInt(0,2); c.stem-=randInt(2,4);
      } else {
        log=[pick(["Sir said you didn't do enough! Tough luck.","You had fun... but also you got a half-hour det. Worth it?"])];
        c.likeability+=randInt(1,3); c.popularity+=randInt(2,4);
        c.behaviour-=randInt(2,3); c.obedience-=randInt(1,2);
        c.general-=randInt(1,2); c.stem-=randInt(3,5);
        state.detentions += 1;
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"s", label:"Stay home and finish it", run:(c)=>{
      const log=[pick(["A bit lame, but you got your homework done!","Boring. But you don't have a det.","Very sensible: You saved yourself a det, but you're probably not getting invited again anytime soon!"])];
      c.likeability-=randInt(2,3); c.popularity-=randInt(3,4);
      c.behaviour+=randInt(2,3); c.obedience+=randInt(2,3); c.maturity+=randInt(2,3);
      c.stem+=randInt(2,3); c.general+=randInt(3,4);
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 9 : May 2022 ----------------
MONTHS.push({
  date: "May, 2022",
  clublist: ["Athletics","Chess"],
  prompt: "It's J5 and your whole year group is forced to volunteer. What will you do?",
  options: [
    { key:"t", label:"Run tours with the kids", run:(c)=>{
      let log;
      if (c.behaviour>=85){
        log=[pick(["Went well! Very informative.","You were responsible and had fun with the kids.","Good job! You were a great guide."])];
        c.social+=randInt(1,3); c.behaviour+=randInt(2,4); c.obedience+=randInt(1,2);
        c.maturity+=randInt(1,3); c.likeability+=randInt(2,4); c.popularity+=randInt(1,2);
        c.stem+=randInt(1,2); c.general+=randInt(1,2);
        c.football-=randInt(0,2); c.cricket-=randInt(0,2); c.racket_sports-=randInt(0,2);
      } else {
        log=[pick(["They certainly had fun... but you were a bit irresponsible!","C'mon, you could've put some more effort into it."])];
        c.social+=randInt(2,4); c.behaviour-=randInt(2,3); c.obedience-=randInt(1,2);
        c.maturity-=randInt(3,4); c.likeability+=randInt(2,3); c.popularity+=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"a", label:"Work in a subject demonstration", run:(c)=>{
      let log;
      if (c.general>=85 || c.stem>=90 || c.arts>=90){
        log=[pick(["You demonstrated well and were engaging.","Good job! Very engaging and informative.","You were educational and fun with the kids."])];
        c.social+=randInt(0,1); c.behaviour+=randInt(3,5); c.obedience+=randInt(2,3);
        c.maturity+=randInt(2,4); c.likeability+=randInt(1,3); c.popularity+=randInt(0,2);
        c.stem+=randInt(2,4); c.arts+=randInt(2,4); c.general+=randInt(3,4);
        c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(1,2);
      } else {
        log=[pick(["Maybe next time, choose a subject you actually understand.","C'mon, you could've put some more effort into it."])];
        c.social+=randInt(1,3); c.behaviour-=randInt(1,3); c.obedience-=randInt(1,2);
        c.maturity-=randInt(1,2); c.likeability-=randInt(2,4); c.popularity+=randInt(2,3);
        c.stem-=randInt(3,4); c.arts-=randInt(2,4); c.general-=randInt(4,5);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"s", label:"Help with the sports section", run:(c)=>{
      let log;
      if (c.football>=90 || c.fitness>=90 || c.cricket>=90 || c.racket_sports>=85){
        log=[pick(["Fun! Showed the kids some skills!","Very informative and engaging.","Impressive skills, the kids loved it!"])];
        c.social+=randInt(2,4); c.behaviour+=randInt(1,2); c.maturity+=randInt(1,2);
        c.likeability+=randInt(3,5); c.popularity+=randInt(3,5);
        c.football+=randInt(1,3); c.cricket+=randInt(1,3); c.racket_sports+=randInt(1,3);
        c.shape+=randInt(2,4); c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(0,1);
      } else {
        log=[pick(["The kids found you a bit boring!","Maybe not the best pick, some of these kids could play better than you did!"])];
        c.social-=randInt(2,3); c.behaviour-=randInt(1,2); c.maturity-=randInt(1,2);
        c.likeability-=randInt(3,4); c.popularity-=randInt(3,5);
        c.football-=randInt(2,3); c.cricket-=randInt(1,3); c.racket_sports-=randInt(1,2);
        c.shape-=randInt(2,3); c.stem-=randInt(1,2); c.general-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 10 : June 2022 ----------------
MONTHS.push({
  date: "June, 2022",
  clublist: [],
  prompt: "END OF YEAR EXAMS! Not as important, but still your first big test. It's also your friend's birthday party the night before the biggest one... What will you do?",
  options: [
    { key:"g", label:"Go to the party, revise a little beforehand", run:(c)=>{
      let log;
      if (c.general>=85 || c.stem>=90 || c.arts>=90){
        log=[pick(["Lucky you, the test was surprisingly easy!","You had fun, came home, and the exam was just fine.","Bit dodgy, but you were alright!"])];
        c.likeability+=randInt(2,3); c.popularity+=randInt(2,3); c.humor+=randInt(1,2);
        c.obedience-=randInt(1,2); c.work_ethic-=randInt(1,2); c.maturity-=randInt(0,2);
        c.stem+=randInt(0,1); c.arts+=randInt(0,1); c.general+=randInt(1,2);
        c.football-=randInt(0,2); c.cricket-=randInt(0,2); c.racket_sports-=randInt(0,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(0,1);
        c.chess+=randInt(0,1);
      } else {
        log=[pick(["You had fun... but also a bad grade. Worth it?","You flunked the test, but hey, you had fun... right?"])];
        c.likeability+=randInt(1,2); c.popularity+=randInt(2,3); c.humor+=randInt(1,2);
        c.obedience-=randInt(2,3); c.work_ethic-=randInt(2,3); c.maturity-=randInt(1,2);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(2,3);
        c.football-=randInt(2,3); c.cricket-=randInt(1,3); c.racket_sports-=randInt(1,2);
        c.speed-=randInt(2,3); c.strength-=randInt(2,3); c.shape-=randInt(1,2);
        c.chess-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"c", label:"Go to the party, sneak a peek at a friend's answers tomorrow", run:(c)=>{
      let log;
      if (c.obedience>=85 && c.maturity>=80){
        log=[pick(["You got away with it!","You're very lucky sir didn't see.","The test was surprisingly easy and you didn't really need to cheat."])];
        c.likeability+=randInt(1,2); c.popularity+=randInt(1,3); c.humor+=randInt(0,2);
        c.obedience-=randInt(2,3); c.work_ethic-=randInt(1,2); c.maturity-=randInt(1,2);
        c.stem+=randInt(0,1); c.arts+=randInt(0,1); c.general+=randInt(0,2);
        c.chess-=randInt(1,2);
      } else {
        log=[pick(["Way too obvious, you got caught.","You sat next to someone who had the same plan as you... and you both failed!"])];
        c.likeability-=randInt(1,2); c.popularity-=randInt(2,3); c.humor-=randInt(1,2);
        c.obedience-=randInt(3,4); c.work_ethic-=randInt(2,3); c.maturity-=randInt(2,3);
        c.stem-=randInt(1,2); c.arts-=randInt(1,2); c.general-=randInt(1,2);
        c.football-=randInt(1,2); c.cricket-=randInt(1,2); c.racket_sports-=randInt(0,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(0,1);
        c.chess-=randInt(2,3);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"s", label:"Stay home and revise", run:(c)=>{
      const log=[pick(["A bit lame, but you passed!","Boring... but you smashed it.","Very sensible: You got full marks, but you're probably not getting invited again anytime soon!"])];
      c.likeability-=randInt(2,3); c.popularity-=randInt(2,3); c.humor-=randInt(1,2);
      c.obedience+=randInt(2,3); c.work_ethic+=randInt(3,4); c.maturity+=randInt(2,4);
      c.stem+=randInt(2,3); c.arts+=randInt(2,3); c.general+=randInt(3,4); c.chess+=randInt(2,3);
      c.football+=randInt(0,2); c.cricket+=randInt(0,2); c.racket_sports+=randInt(0,2);
      c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape+=randInt(1,2);
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});

// ---------------- Month 11 : July 2022 (Sports day) ----------------
// Note: original Python referenced an undefined `chosen.other` attribute (a bug) for the
// "different sport" option - mapped here to `fitness` (speed/strength/shape average) since
// that's clearly what the athletics-flavoured text and deltas were describing.
MONTHS.push({
  date: "July, 2022",
  clublist: ["Football"],
  prompt: "Today is sports day! What will you apply for?",
  options: [
    { key:"f", label:"Football", run:(c)=>{
      let log;
      if (c.football>=85){
        log=[pick(["You got in the football team and played well!","Solid performance on the pitch — nice one!","Bit dodgy at times, but you won your matches!"])];
        c.football+=randInt(2,4); c.popularity+=randInt(2,4); c.likeability+=randInt(1,3);
        c.maturity+=randInt(0,2); c.racket_sports+=randInt(1,2); c.speed+=randInt(1,2);
        c.strength+=randInt(1,2); c.shape+=randInt(1,2);
      } else {
        log=[pick(["You didn't make the football team. Rough one.","You barely got in but flopped every game..."])];
        c.football-=randInt(3,5); c.popularity-=randInt(2,4); c.likeability-=randInt(1,3);
        c.maturity-=randInt(1,2); c.racket_sports-=randInt(1,2); c.speed-=randInt(1,2);
        c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"c", label:"Cricket", run:(c)=>{
      let log;
      if (c.cricket>=85){
        log=[pick(["You smashed it in cricket — good shots and solid bowling!","Great contribution to the cricket team.","You stood out and got some cheers!"])];
        c.cricket+=randInt(2,4); c.popularity+=randInt(1,3); c.likeability+=randInt(1,2);
        c.racket_sports+=randInt(1,2); c.maturity+=randInt(0,2);
        c.speed+=randInt(1,2); c.strength+=randInt(1,2); c.shape+=randInt(1,2);
      } else {
        log=[pick(["Missed catches, sloppy play... wasn't your day.","Barely made it in but didn't impress."])];
        c.cricket-=randInt(2,4); c.popularity-=randInt(1,3); c.likeability-=randInt(1,2);
        c.racket_sports-=randInt(1,2); c.maturity-=randInt(1,2);
        c.speed-=randInt(1,2); c.strength-=randInt(1,2); c.shape-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"r", label:"A racket sport", run:(c)=>{
      let log;
      if (c.racket_sports>=85){
        log=[pick(["You won your matches comfortably.","Sharp serves and great rallies — crowd enjoyed it!","Very solid racket sports showing!"])];
        c.racket_sports+=randInt(2,4); c.popularity+=randInt(1,3); c.likeability+=randInt(1,2); c.cricket+=randInt(1,2);
      } else {
        log=[pick(["Lost most of your matches — bit embarrassing.","Your opponent destroyed you on the court..."])];
        c.racket_sports-=randInt(2,4); c.popularity-=randInt(1,2); c.likeability-=randInt(1,2); c.cricket-=randInt(0,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"o", label:"A different sport (athletics)", run:(c)=>{
      let log;
      if (c.fitness>=80){
        log=[pick(["You shone in athletics — very fast and strong!","Won your events and impressed the crowd.","Solid performance, kids were cheering for you!"])];
        c.speed+=randInt(3,4); c.strength+=randInt(3,4); c.shape+=randInt(3,4);
        c.popularity+=randInt(2,3); c.likeability+=randInt(1,2); c.maturity+=randInt(0,1);
      } else {
        log=[pick(["You got outshined badly... not your day.","Bit embarrassing, even the cricket match finished quicker than you!"])];
        c.speed-=randInt(2,3); c.strength-=randInt(2,3); c.shape-=randInt(2,3);
        c.popularity-=randInt(1,3); c.likeability-=randInt(1,2); c.maturity-=randInt(1,2);
      }
      clampAll(c); deriveStats(c); return log;
    }},
    { key:"a", label:"Do something irrelevant instead", run:(c,state)=>{
      const log=[pick(["Not into sports? If that's what you want","Alright, your choice (you probably weren't good enough anyway, but at least you didn't embarrass yourself!)"])];
      state.skip += 2;
      const amt = state.skip;
      const keys = ["football","cricket","racket_sports","speed","strength","shape","stem","arts","general","likeability","popularity","humor","obedience","work_ethic","maturity","chess"];
      keys.forEach(k => c[k] -= amt);
      clampAll(c); deriveStats(c); return log;
    }},
  ],
  skip:false,
});




// Each returns { log: [...] } and mutates c / state as needed.
// state: { additioncounter, clubnumcheck, clublist, characters, chosen, detentions }

function joinClub(state, clubChoice){
  const c = state.chosen;
  if (state.additioncounter >= 5){
    return { log: ["Run out of additional activities for this month. Please go to the next to get some more"] };
  }
  if (!state.clublist || state.clublist.length === 0){
    return { log: ["None available at this time. Try again later"] };
  }
  if (!state.clublist.includes(clubChoice)){
    return { log: ["Not an option."] };
  }
  c.football+=1; c.cricket+=1; c.racket_sports+=1;
  c.speed+=1; c.strength+=1; c.shape+=1;
  c.stem+=2; c.arts+=2; c.general+=3;
  c.likeability-=1; c.popularity+=1; c.humor+=1;
  c.obedience+=2; c.work_ethic+=3; c.maturity+=2; c.chess+=1;
  clampAll(c); deriveStats(c);
  state.additioncounter += 1;
  return { log: [`Well done. You have joined ${clubChoice} club`] };
}

function makeFriend(state){
  const c = state.chosen;
  if (state.additioncounter >= 5){
    return { log: ["Run out of additional activities for this month. Please go to the next to get some more"] };
  }
  let success, log;
  if (c.social <= 65){
    success = randInt(1,8) === 1;
    log = success
      ? "Found! Lucky you. An addition to your (pretty small) list of friends."
      : "Welp. Nobody. Maybe you need to up your social game!";
  } else if (c.social <= 75){
    success = randInt(1,4) === 1;
    log = success ? "YAY. You found someone. Lucky you" : "Not this time, sorry. Try again later!";
  } else if (c.social <= 85){
    success = randInt(1,5) !== 1;
    log = success ? "You got one! Your friendship group is expanding even more." : "Tough, you couldn't find anyone. But be sure to try again later, there's bound to be more opportunities.";
  } else {
    success = randInt(1,10) !== 1;
    log = success ? "Found! Lucky you. Another addition to your (pretty big) list of friends." : "Wow, that's unlucky, you're normally more popular; but it's probably just a one-off, be sure to try again later!";
  }
  const sign = success ? 1 : -1;
  c.football += sign*1; c.cricket += sign*1; c.racket_sports += sign*1;
  c.speed += sign*1; c.strength += sign*1; c.shape += sign*2;
  c.stem += sign*1; c.arts += sign*1; c.general += sign*(success?3:2);
  c.likeability += sign*3; c.popularity += sign*3; c.humor += sign*(success?3:2);
  c.obedience += sign*1; c.work_ethic += sign*1; c.maturity += sign*2; c.chess += sign*1;
  clampAll(c); deriveStats(c);
  state.additioncounter += 1;
  return { log: [log], success };
}

function extraStudy(state){
  const c = state.chosen;
  if (state.additioncounter >= 5){
    return { log: ["Run out of additional activities for this month. Please go to the next to get some more"] };
  }
  c.football-=2; c.cricket-=2; c.racket_sports-=1;
  c.speed-=2; c.strength-=1; c.shape-=1;
  c.stem+=3; c.arts+=3; c.general+=2;
  c.likeability-=5; c.popularity-=4; c.humor-=4;
  c.obedience+=3; c.work_ethic+=5; c.maturity+=4; c.chess+=2;
  clampAll(c); deriveStats(c);
  state.additioncounter += 1;
  return { log: ["Great. Getting some extra learning in is bound to help!"] };
}

function checkOtherStats(state, name){
  const char = state.characters.find(ch => ch.name === name);
  if (!char) return { log: ["Character not found."] };
  return { log: [], char };
}

function rankings(state){
  const c = state.chosen;
  const pool = state.characters.includes(c) ? state.characters : [c, ...state.characters];
  const stats = ["football","cricket","racket_sports","speed","strength","shape","stem","arts","general","likeability","popularity","humor","obedience","work_ethic","maturity","chess"];
  const lines = [];
  for (const stat of stats){
    const ranking = [...pool].sort((a,b) => b[stat]-a[stat]);
    const position = ranking.indexOf(c) + 1;
    const total = ranking.length;
    const above = position > 1 ? ranking[position-2].name : "Nobody";
    const below = position < total ? ranking[position].name : "Nobody";
    const label = stat.charAt(0).toUpperCase()+stat.slice(1).replace("_"," ");
    if (above === "Nobody"){
      lines.push(`${label}: You are the highest in the class. You are above ${below}.`);
    } else if (below === "Nobody"){
      lines.push(`${label}: You are the worst in the class. You are below ${above}.`);
    } else {
      lines.push(`${label}: You are ${position} out of ${total}. You are above ${below} but below ${above}.`);
    }
  }
  return { log: lines };
}



// ============================================================
// APP CONTROLLER — BitLife-style shell
// ============================================================
const STAT_GROUPS = [
  { label:"Sports", icon:"⚽", keys:["football","cricket","racket_sports"], avg:"sports" },
  { label:"Fitness", icon:"💪", keys:["speed","strength","shape"], avg:"fitness" },
  { label:"Brains", icon:"🧠", keys:["stem","arts","general"], avg:"intelligence" },
  { label:"Social", icon:"👥", keys:["likeability","popularity","humor"], avg:"social" },
  { label:"Behaviour", icon:"📋", keys:["obedience","work_ethic","maturity"], avg:"behaviour" },
];
const STAT_LABELS = {
  football:"Football", cricket:"Cricket", racket_sports:"Racket Sports",
  speed:"Speed", strength:"Strength", shape:"Shape",
  stem:"STEM", arts:"Arts", general:"General",
  likeability:"Likeability", popularity:"Popularity", humor:"Humor",
  obedience:"Obedience", work_ethic:"Work Ethic", maturity:"Maturity",
  chess:"Chess"
};
var ALL_STAT_KEYS = ["football","cricket","racket_sports","speed","strength","shape","stem","arts","general","likeability","popularity","humor","obedience","work_ethic","maturity","chess"];

const app = document.getElementById("app");

var state = {
  screen: "intro",
  navStack: [],
  legacyMode: false,
  pool: [],
  chosen: null,
  characters: [],
  monthIdx: 0,
  detentions: 0,
  skip: 1,
  additioncounter: 0,
  clubnumcheck: 0,
  clublist: [],
  cliqueBonus: null,
  cliqueName: null,
  cliqueDone: false,
  cliqueMode: "initial",
  justDidClique: false,
  relationships: {},
  categoryTrend: {},
  npcCliques: {},
  cliqueId: null,
  currentClub: null,
  clubChangeMonth: null,
  history: [],
  cliqueChangeMonth: null,
  modal: null,
  lastLog: [],
  lastBefore: null,
  lastNewDets: 0,
  customDraft: null,
  rosterFilter: "All",
};

// ---------------- DOM helpers ----------------
function el(tag, opts={}, children=[]){
  const e = document.createElement(tag);
  if (opts.class) e.className = opts.class;
  if (opts.text !== undefined) e.textContent = opts.text;
  if (opts.html !== undefined) e.innerHTML = opts.html;
  if (opts.onclick) e.addEventListener("click", opts.onclick);
  if (opts.attrs) for (const k in opts.attrs) e.setAttribute(k, opts.attrs[k]);
  children.forEach(c => c && e.appendChild(c));
  return e;
}
function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); }

function percentileOf(value, values){
  const n = values.length;
  if (n <= 1) return 50;
  let less = 0, equal = 0;
  for (const v of values){ if (v < value) less++; else if (v === value) equal++; }
  return (less + (equal - 1) / 2) / (n - 1) * 100;
}
function starCountForPercentile(p){
  if (p < 15) return 1;
  if (p < 15 + 70/3) return 2;
  if (p < 15 + 2*70/3) return 3;
  if (p < 85) return 4;
  return 5;
}
function starGlyphs(n){
  n = Math.max(1, Math.min(5, n));
  return "★".repeat(n) + "☆".repeat(5-n);
}
function starsFor(value, population){
  if (!population || population.length <= 1) return starGlyphs(Math.round(value/20) || 1);
  const p = percentileOf(value, population);
  return starGlyphs(starCountForPercentile(p));
}

function lerpColor(a,b,t){
  const r = Math.round(a[0]+(b[0]-a[0])*t);
  const g = Math.round(a[1]+(b[1]-a[1])*t);
  const bl = Math.round(a[2]+(b[2]-a[2])*t);
  return `rgb(${r},${g},${bl})`;
}
function statColor(value){
  const v = Math.max(0, Math.min(100, value));
  const red = [0x93,0x36,0x2D], mid = [0xC9,0x8A,0x2C], green = [0x3E,0x6A,0x4F];
  if (v <= 50) return lerpColor(red, mid, v/50);
  return lerpColor(mid, green, (v-50)/50);
}

function starLines(c, population){
  const wrap = el("div",{class:"roster-stars"});
  STAT_GROUPS.forEach(g=>{
    const values = population.map(p=>p[g.avg]);
    wrap.appendChild(el("div",{class:"roster-star-line"},[
      el("span",{class:"roster-star-label", text:`${g.icon} ${g.label}`}),
      el("span",{class:"roster-star-value", text:starsFor(c[g.avg], values)}),
    ]));
  });
  return wrap;
}

function dateLabel(){
  return state.monthIdx < MONTHS.length ? currentMonth().date : "End of Year 7";
}
function logEvent(lines){
  if (!lines || !lines.length) return;
  const label = dateLabel();
  const last = state.history[state.history.length - 1];
  if (last && last.date === label){
    last.lines.push(...lines);
  } else {
    state.history.push({ date: label, lines: lines.slice() });
  }
}

// ---------------- Relationships ----------------
function similarity(a, b){
  const diffs = STAT_GROUPS.map(g => a[g.avg] - b[g.avg]);
  const meanSquare = diffs.reduce((s,d)=>s+d*d, 0) / diffs.length;
  return 100 - Math.sqrt(meanSquare);
}
function relationshipOf(name){
  return state.relationships[name] || 0;
}
function friendCount(){
  return Object.values(state.relationships).filter(v => v >= 100).length;
}

// Rival clique groups: any clique in the first list opposes any clique in the second, and vice versa.
var CLIQUE_RIVALRIES = [
  [["football","sporty","cricket","gym"], ["brains","chess"]],
  [["behaved"], ["troublesome"]],
  [["social"], ["losers"]],
];
function cliquesOppose(idA, idB){
  if (!idA || !idB || idA === idB) return false;
  return CLIQUE_RIVALRIES.some(([g1,g2]) =>
    (g1.includes(idA) && g2.includes(idB)) || (g2.includes(idA) && g1.includes(idB))
  );
}
function assignNPCCliques(){
  state.npcCliques = {};
  state.characters.forEach(ch=>{
    const options = availableCliques(ch);
    state.npcCliques[ch.name] = options.length ? pick(options).id : "mid_mandem";
  });
}

function passiveRelationshipUpdate(){
  state.characters.forEach(ch=>{
    const sim = similarity(state.chosen, ch);
    let gain = Math.max(0, Math.round((sim - 50) / 10));
    if (state.cliqueDone){
      const theirClique = state.npcCliques[ch.name];
      if (theirClique && theirClique === state.cliqueId) gain += 2;
      else if (cliquesOppose(state.cliqueId, theirClique)) gain -= 2;
    }
    if (gain !== 0){
      const cur = relationshipOf(ch.name);
      state.relationships[ch.name] = Math.max(0, Math.min(100, cur + gain));
    }
  });
}
function driftTowardFriends(){
  const friends = state.characters.filter(ch => relationshipOf(ch.name) >= 100);
  if (friends.length === 0) return;
  ALL_STAT_KEYS.forEach(k=>{
    const avg = friends.reduce((s,f)=>s+f[k],0) / friends.length;
    if (state.chosen[k] < avg) state.chosen[k] = Math.min(100, state.chosen[k] + 1);
    else if (state.chosen[k] > avg) state.chosen[k] = Math.max(0, state.chosen[k] - 1);
  });
  clampAll(state.chosen);
  deriveStats(state.chosen);
}
function relationshipTick(){
  passiveRelationshipUpdate();
  driftTowardFriends();
}

// ---------------- Navigation ----------------
function goto(screen){
  state.navStack.push(state.screen);
  state.screen = screen;
  state.modal = null;
  render();
}
function goBack(){
  const prev = state.navStack.pop();
  state.screen = prev || (state.chosen ? "hub" : "intro");
  render();
}
function resetNav(screen){
  state.navStack = [];
  state.screen = screen;
  render();
}
function backButton(){
  return el("button",{class:"btn-back", text:"← Return to previous", onclick:goBack});
}

// ---------------- Root render ----------------
function render(){
  clear(app);
  const frame = el("div",{class:"phone-frame fade-in"});
  app.appendChild(frame);
  switch(state.screen){
    case "intro": renderIntro(frame); break;
    case "modeSelect": renderModeSelect(frame); break;
    case "legacySelect": renderLegacySelect(frame); break;
    case "rosterPick": renderRosterPick(frame); break;
    case "charConfirm": renderCharConfirm(frame); break;
    case "customName": renderCustomName(frame); break;
    case "customStatMode": renderCustomStatMode(frame); break;
    case "customManual": renderCustomManual(frame); break;
    case "hub": renderHub(frame); break;
    case "monthChoice": renderMonthChoice(frame); break;
    case "cliqueChoice": renderCliqueChoice(frame); break;
    case "breakdown": renderBreakdown(frame); break;
    case "clubs": renderClubs(frame); break;
    case "friends": renderFriends(frame); break;
    case "growth": renderGrowth(frame); break;
    case "statsSection": renderStatsSection(frame); break;
    case "npcDetail": renderNpcDetail(frame); break;
    case "rankingsView": renderRankingsView(frame); break;
    case "yearEnd": renderYearEnd(frame); break;
  }
  if (state.modal) appendModal(frame);
}

// Softens the raw stat swings baked into the underlying event data, without having to
// hand-edit every randInt() range across months.js/additions.js. Detentions, relationships,
// friend counts etc. are untouched -- only state.chosen's 16 raw stats get rescaled.
const STAT_CHANGE_SCALE = 0.5;
function runScaled(mutateFn){
  const before = { ...state.chosen };
  const result = mutateFn();
  ALL_STAT_KEYS.forEach(k=>{
    const rawDiff = state.chosen[k] - before[k];
    if (rawDiff === 0) return;
    let scaled = Math.round(rawDiff * STAT_CHANGE_SCALE);
    if (scaled === 0) scaled = rawDiff > 0 ? 1 : -1;
    state.chosen[k] = before[k] + scaled;
  });
  clampAll(state.chosen);
  deriveStats(state.chosen);
  const after = { ...state.chosen };
  return { result, before, after };
}

function computeDeltaChips(before, after){
  if (!before || !after) return [];
  return ALL_STAT_KEYS
    .map(k => ({ key:k, diff: after[k]-before[k] }))
    .filter(d => d.diff !== 0);
}
function updateCategoryTrend(before, after){
  if (!before || !after) return;
  const trend = {};
  STAT_GROUPS.forEach(g => { trend[g.avg] = after[g.avg] - before[g.avg]; });
  state.categoryTrend = trend;
}
function showModal(lines, before, after){
  state.modal = { lines, deltas: computeDeltaChips(before, after) };
  updateCategoryTrend(before, after);
  render();
}
function closeModal(){
  state.modal = null;
  render();
}
function appendModal(frame){
  const overlay = el("div",{class:"modal-overlay"});
  const box = el("div",{class:"modal-box"});
  state.modal.lines.forEach(line => box.appendChild(el("p",{class:"result-text", text:line})));
  if (state.modal.deltas && state.modal.deltas.length){
    const deltaWrap = el("div",{class:"delta-report"});
    state.modal.deltas.forEach(d=>{
      const up = d.diff > 0;
      const arrow = up ? "▲" : "▼";
      const chip = el("span",{class:"delta-chip "+(up?"delta-up":"delta-down"),
        text:`${arrow} ${STAT_LABELS[d.key]} ${up?"+":""}${d.diff}`});
      deltaWrap.appendChild(chip);
    });
    box.appendChild(deltaWrap);
  }
  box.appendChild(el("button",{class:"btn btn-primary", text:"OK", onclick: closeModal}));
  overlay.appendChild(box);
  frame.appendChild(overlay);
}

// ---------------- INTRO ----------------
function renderIntro(page){
  page.appendChild(el("div",{class:"crest"},[el("span",{text:"ICHS"})]));
  page.appendChild(el("h1",{class:"title", text:"ICHS LifeSim"}));
  page.appendChild(el("p",{class:"subtitle", text:"Live a year in the life of an ICHS student, starting from Year 7."}));
  page.appendChild(el("button",{class:"btn btn-primary", text:"Begin", onclick:()=>{ resetNav("modeSelect"); }}));
}

// ---------------- MODE SELECT ----------------
function renderModeSelect(page){
  page.appendChild(el("h1",{class:"big-title", text:"Choose your mode"}));
  const stack = el("div",{class:"stack stack-fill"});
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Classic Mode", onclick:()=>{ goto("legacySelect"); }}));
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Custom Mode", onclick:()=>{
    state.customDraft = { statMode:null, form:"H1" };
    goto("customName");
  }}));
  page.appendChild(stack);
  page.appendChild(backButton());
}

// ---------------- LEGACY / WHOLE SCHOOL ----------------
function renderLegacySelect(page){
  page.appendChild(el("h1",{class:"big-title", text:"Choose your roster"}));
  const stack = el("div",{class:"stack stack-fill"});
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Legacy Mode (H1 only)", onclick:()=>{
    state.legacyMode = true;
    setupPool();
    goto("rosterPick");
  }}));
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Whole School Mode", onclick:()=>{
    state.legacyMode = false;
    setupPool();
    goto("rosterPick");
  }}));
  page.appendChild(stack);
  page.appendChild(backButton());
}

function setupPool(){
  let all = makeCharacters().filter(c => c.name !== "Noname");
  if (state.legacyMode) all = all.filter(c => c.form === "H1");
  state.pool = all;
  state.rosterFilter = "All";
}

// ---------------- ROSTER PICK ----------------
function renderRosterPick(page){
  page.appendChild(el("h2",{class:"h2", text:"Choose your character"}));

  const forms = [...new Set(state.pool.map(c=>c.form))].sort();
  if (forms.length > 1){
    const filterRow = el("div",{class:"filter-row"});
    const makeChip = (label,value)=> el("button",{
      class:"filter-chip" + (state.rosterFilter===value ? " filter-chip-active" : ""),
      text:label,
      onclick:()=>{ state.rosterFilter = value; render(); }
    });
    filterRow.appendChild(makeChip("All","All"));
    forms.forEach(f=> filterRow.appendChild(makeChip(f,f)));
    page.appendChild(filterRow);
  }

  const list = el("div",{class:"roster-list"});
  let shown = state.pool.slice().sort((a,b)=>a.name.localeCompare(b.name));
  if (state.rosterFilter !== "All") shown = shown.filter(c=>c.form===state.rosterFilter);
  shown.forEach(c=>{
    const row = el("div",{class:"roster-row", onclick:()=>{
      state.chosen = { ...c };
      deriveStats(state.chosen);
      state.characters = state.pool.filter(p => p.name !== c.name).map(p=>({...p}));
      goto("charConfirm");
    }});
    row.appendChild(el("div",{class:"roster-icon", text:c.name.charAt(0)}));
    const info = el("div",{class:"roster-info"});
    info.appendChild(el("div",{class:"roster-name-row"},[
      el("span",{class:"roster-name", text:c.name}),
      el("span",{class:"roster-form", text:c.form}),
    ]));
    const starsRow = starLines(c, state.pool);
    info.appendChild(starsRow);
    row.appendChild(info);
    list.appendChild(row);
  });
  page.appendChild(list);
  page.appendChild(backButton());
}

// ---------------- CUSTOM CHARACTER ----------------
function renderCustomName(page){
  page.appendChild(el("h2",{class:"h2", text:"Custom Character Creation"}));
  const input = el("input",{class:"text-input", attrs:{type:"text", placeholder:"Character name", maxlength:"24"}});
  page.appendChild(input);
  page.appendChild(el("div",{class:"form-row"},[
    el("label",{class:"body-text", text:"Form: "}),
    formSelect(),
  ]));
  page.appendChild(el("button",{class:"btn btn-primary", text:"Next", onclick:()=>{
    let name = input.value.trim();
    if (!name) name = "Tomdickandharry";
    state.customDraft.name = name;
    state.customDraft.form = document.getElementById("form-select").value;
    goto("customStatMode");
  }}));
  page.appendChild(backButton());
}
function formSelect(){
  const sel = el("select",{class:"select-input", attrs:{id:"form-select"}});
  ["H1","H2","E1","E2","F1","F2"].forEach(f=>{
    const o = document.createElement("option"); o.value=f; o.textContent=f; sel.appendChild(o);
  });
  return sel;
}

function renderCustomStatMode(page){
  page.appendChild(el("h1",{class:"big-title", text:`Creating ${state.customDraft.name}`}));
  const stack = el("div",{class:"stack stack-fill"});
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Randomise stats", onclick:()=>{
    buildCustomCharacter(true);
    goto("charConfirm");
  }}));
  stack.appendChild(el("button",{class:"btn btn-stack btn-stack-big", text:"Set stats yourself", onclick:()=>{
    goto("customManual");
  }}));
  page.appendChild(stack);
  page.appendChild(backButton());
}

function buildCustomCharacter(random){
  const c = { name: state.customDraft.name, form: state.customDraft.form };
  if (random){
    c.football=randInt(0,100); c.cricket=randInt(0,100); c.racket_sports=randInt(0,100);
    c.speed=randInt(0,100); c.strength=randInt(0,100); c.shape=randInt(0,100);
    c.stem=randInt(0,100); c.arts=randInt(0,100); c.general=randInt(0,100);
    c.likeability=randInt(0,100); c.popularity=randInt(0,100); c.humor=randInt(0,100);
    c.obedience=randInt(0,100); c.work_ethic=randInt(0,100); c.maturity=randInt(0,100);
    c.chess=randInt(0,100);
  }
  deriveStats(c);
  state.chosen = c;
  state.legacyMode = false;
  const all = makeCharacters().filter(ch => ch.name !== "Noname");
  state.characters = all;
}

function renderCustomManual(page){
  page.appendChild(el("h2",{class:"h2", text:"Set your stats"}));
  page.appendChild(el("p",{class:"body-text", text:"Drag each slider between 0 and 100."}));
  const form = el("div",{class:"manual-form"});
  const keys = ALL_STAT_KEYS;
  const inputs = {};
  keys.forEach(k=>{
    const row = el("div",{class:"slider-row"});
    const label = el("label",{class:"slider-label", text:STAT_LABELS[k]});
    const valSpan = el("span",{class:"slider-value", text:"50"});
    const slider = el("input",{attrs:{type:"range", min:"0", max:"100", value:"50"}});
    slider.addEventListener("input", ()=>{ valSpan.textContent = slider.value; });
    inputs[k]=slider;
    row.appendChild(label); row.appendChild(slider); row.appendChild(valSpan);
    form.appendChild(row);
  });
  page.appendChild(form);
  page.appendChild(el("button",{class:"btn btn-primary", text:"Create character", onclick:()=>{
    const c = { name: state.customDraft.name, form: state.customDraft.form };
    keys.forEach(k => c[k] = parseInt(inputs[k].value,10));
    deriveStats(c);
    state.chosen = c;
    const all = makeCharacters().filter(ch => ch.name !== "Noname");
    state.characters = all;
    goto("charConfirm");
  }}));
  page.appendChild(backButton());
}

// ---------------- CONFIRM & START ----------------
function renderCharConfirm(page){
  const c = state.chosen;
  page.appendChild(el("h2",{class:"h2", text:`${c.name} — ${c.form}`}));
  page.appendChild(statReport(c));
  page.appendChild(el("p",{class:"body-text", text:"Remember: your choices shape these stats all year. Skipping a challenge is always possible, but skipping repeatedly costs you more each time."}));
  page.appendChild(el("button",{class:"btn btn-primary", text:"Ready to start?", onclick:()=>{
    state.monthIdx = 0;
    state.detentions = 0; state.skip = 1; state.additioncounter = 0; state.clubnumcheck = 0;
    state.relationships = {}; state.currentClub = null; state.clubChangeMonth = null; state.categoryTrend = {};
    state.cliqueDone = false; state.cliqueName = null; state.cliqueId = null; state.cliqueBonus = null;
    state.cliqueChangeMonth = null; state.history = []; state.modal = null;
    state.clublist = MONTHS[0].clublist;
    assignNPCCliques();
    resetNav("hub");
  }}));
  page.appendChild(backButton());
}

function statReport(c){
  const wrap = el("div",{class:"report"});
  STAT_GROUPS.forEach(g=>{
    const block = el("div",{class:"report-group"});
    block.appendChild(el("div",{class:"report-group-title"}, [
      el("span",{text:`${g.icon} ${g.label}`}),
      el("span",{class:"report-avg", text:c[g.avg]+""}),
    ]));
    const bars = el("div",{class:"report-bars"});
    g.keys.forEach(k=>{
      bars.appendChild(statBar(STAT_LABELS[k], c[k]));
    });
    block.appendChild(bars);
    wrap.appendChild(block);
  });
  wrap.appendChild(statBar("Chess", c.chess));
  return wrap;
}

function statBar(label, value){
  const row = el("div",{class:"stat-bar-row"});
  row.appendChild(el("div",{class:"stat-bar-label", text:label}));
  const track = el("div",{class:"stat-bar-track"});
  const fill = el("div",{class:"stat-bar-fill"});
  fill.style.width = Math.max(0,Math.min(100,value)) + "%";
  fill.style.background = statColor(value);
  track.appendChild(fill);
  row.appendChild(track);
  row.appendChild(el("div",{class:"stat-bar-value", text:value}));
  return row;
}

// ================================================================
// HUB — main BitLife-style screen
// ================================================================
function currentMonth(){ return MONTHS[state.monthIdx]; }

function renderHub(page){
  page.className += " hub-page";
  const c = state.chosen;
  state.clublist = currentMonth() ? currentMonth().clublist : [];

  const topBar = el("div",{class:"hub-topbar"});
  topBar.appendChild(el("div",{class:"hub-date"}, [
    el("span",{text: dateLabel()})
  ]));
  page.appendChild(topBar);

  const idCard = el("div",{class:"id-card"});
  idCard.appendChild(el("div",{class:"id-portrait", text:c.name.charAt(0)}));
  idCard.appendChild(el("div",{class:"id-info"},[
    el("div",{class:"id-name", text:c.name}),
    el("div",{class:"id-sub", text:`${c.form} · Detentions: ${state.detentions}`}),
  ]));
  page.appendChild(idCard);

  const feed = el("div",{class:"hub-feed"});
  if (state.history.length === 0){
    feed.appendChild(el("p",{class:"body-text muted", text:"Nothing has happened yet — tap Next to begin your year."}));
  } else {
    state.history.forEach(entry=>{
      const item = el("div",{class:"feed-item"});
      item.appendChild(el("div",{class:"feed-date", text:entry.date}));
      entry.lines.forEach(line=> item.appendChild(el("p",{class:"feed-text", text:line})));
      feed.appendChild(item);
    });
  }
  page.appendChild(feed);

  const nav = el("div",{class:"bottom-nav"});
  nav.appendChild(navButton("🏫","Clubs", ()=>goto("clubs")));
  nav.appendChild(navButton("👥","Friends", ()=>goto("friends")));
  const ageSlot = el("div",{class:"age-slot"});
  const ageBtn = el("button",{class:"age-btn", text:"+", onclick:()=>{ startMonthEvent(); }});
  ageSlot.appendChild(ageBtn);
  ageSlot.appendChild(el("div",{class:"age-caption", text:"Next"}));
  nav.appendChild(ageSlot);
  nav.appendChild(navButton("📚","Growth", ()=>goto("growth")));
  nav.appendChild(navButton("📊","Stats", ()=>goto("statsSection")));
  page.appendChild(nav);

  const statsFooter = el("div",{class:"hub-stats", onclick:()=>{ goto("breakdown"); }});
  STAT_GROUPS.forEach(g=>{
    const row = el("div",{class:"hub-stat-row"});
    row.appendChild(el("div",{class:"hub-stat-label", text:`${g.icon} ${g.label}`}));
    const track = el("div",{class:"stat-bar-track"});
    const fill = el("div",{class:"stat-bar-fill"});
    fill.style.width = Math.max(0,Math.min(100,c[g.avg])) + "%";
    fill.style.background = statColor(c[g.avg]);
    track.appendChild(fill);
    row.appendChild(track);
    const valueWrap = el("div",{class:"hub-stat-value"});
    valueWrap.appendChild(el("span",{text: c[g.avg]}));
    const trend = state.categoryTrend[g.avg];
    if (trend > 0) valueWrap.appendChild(el("span",{class:"trend-arrow trend-up", text:" ▲"}));
    else if (trend < 0) valueWrap.appendChild(el("span",{class:"trend-arrow trend-down", text:" ▼"}));
    row.appendChild(valueWrap);
    statsFooter.appendChild(row);
  });
  statsFooter.appendChild(el("div",{class:"hub-stats-hint", text:"Tap for full breakdown"}));
  page.appendChild(statsFooter);

  // Scroll the feed to the newest entry once the whole hub layout has settled
  const scrollFeedToBottom = () => { feed.scrollTop = feed.scrollHeight; };
  scrollFeedToBottom();
  setTimeout(scrollFeedToBottom, 0);
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(scrollFeedToBottom);
}

function navButton(icon,label,onclick){
  return el("button",{class:"nav-btn", onclick},[
    el("div",{class:"nav-icon", text:icon}),
    el("div",{class:"nav-label", text:label}),
  ]);
}

function startMonthEvent(){
  if (state.monthIdx >= MONTHS.length){ state.screen="yearEnd"; render(); return; }
  if (state.monthIdx === 6 && !state.cliqueDone){
    state.cliqueMode = "initial";
    goto("cliqueChoice");
    return;
  }
  goto("monthChoice");
}

// ---------------- MONTH CHOICE (dropdown) ----------------
function renderMonthChoice(page){
  const m = currentMonth();
  page.appendChild(el("h1",{class:"big-title", text:"NEW CHOICE"}));
  page.appendChild(el("div",{class:"month-badge", text:m.date}));
  page.appendChild(el("h2",{class:"h2", text:m.prompt}));

  const stack = el("div",{class:"stack"});
  m.options.forEach(opt=>{
    stack.appendChild(el("button",{class:"btn btn-stack", text:opt.label, onclick:()=>{
      const { result: log, before, after } = runScaled(() => opt.run(state.chosen, state));
      logEvent(log);
      advanceAfterResult();
      showModal(log, before, after);
    }}));
  });
  page.appendChild(stack);

  if (m.skip){
    page.appendChild(el("button",{class:"btn btn-stack btn-skip-option", text:"Skip — sit this one out", onclick:()=>{
      const before = { ...state.chosen };
      const log = applySkip(state.chosen, state);
      const after = { ...state.chosen };
      logEvent(log);
      advanceAfterResult();
      showModal(log, before, after);
    }}));
  }

  page.appendChild(backButton());
}

function advanceAfterResult(){
  const newDets = changeMonth(state).newDets;
  relationshipTick();
  state.lastNewDets = newDets;
  state.additioncounter = 0;
  state.navStack = [];
  if (state.monthIdx < MONTHS.length-1){
    state.monthIdx += 1;
    state.screen = "hub";
  } else {
    state.monthIdx += 1;
    state.screen = "yearEnd";
  }
  render();
}

// ---------------- CLIQUE CHOICE ----------------
function renderCliqueChoice(page){
  const isInitial = state.cliqueMode === "initial";
  page.appendChild(el("div",{class:"month-badge", text: isInitial ? "March, 2022" : dateLabel()}));
  page.appendChild(el("h2",{class:"h2", text: isInitial
    ? "You've been at ICHS over 6 months now. It's time to choose your clique."
    : "Fancy a change? Pick a new clique."}));
  page.appendChild(el("p",{class:"body-text", text:"Your options depend on your current stats — only cliques you qualify for are shown."}));
  const options = availableCliques(state.chosen);
  const stack = el("div",{class:"stack"});
  if (options.length === 0){
    page.appendChild(el("p",{class:"result-text", text:"Well...there is nothing special about you. You are average. Welcome to the 'Mid mandem' clique."}));
    page.appendChild(el("button",{class:"btn btn-primary", text:"Continue", onclick:()=>{
      state.cliqueDone = true; state.cliqueName = "Mid mandem"; state.cliqueId = "mid_mandem"; state.cliqueBonus = null;
      state.cliqueChangeMonth = state.monthIdx;
      logEvent([`You joined the 'Mid mandem' clique.`]);
      finishClique(isInitial);
    }}));
  } else {
    options.forEach(cl=>{
      stack.appendChild(el("button",{class:"btn btn-stack", text:cl.label, onclick:()=>{
        state.cliqueDone = true; state.cliqueName = cl.label; state.cliqueId = cl.id; state.cliqueBonus = cl.deltas;
        state.cliqueChangeMonth = state.monthIdx;
        applyDeltas(state.chosen, cl.deltas);
        logEvent([isInitial ? `You joined the ${cl.label}.` : `You changed cliques — welcome to the ${cl.label}.`]);
        finishClique(isInitial);
      }}));
    });
    page.appendChild(stack);
  }
  if (!isInitial) page.appendChild(backButton());
}

function finishClique(isInitial){
  if (isInitial){
    state.lastNewDets = changeMonth(state).newDets;
    relationshipTick();
    state.justDidClique = true;
    state.navStack = [];
    state.screen = "hub";
  } else {
    state.navStack = [];
    state.screen = "friends";
  }
  render();
}

// ---------------- BREAKDOWN ----------------
function renderBreakdown(page){
  page.appendChild(el("h2",{class:"h2", text:`${state.chosen.name}'s full stats`}));
  page.appendChild(statReport(state.chosen));
  page.appendChild(el("p",{class:"body-text", text:`Detentions so far: ${state.detentions}`}));
  page.appendChild(backButton());
}

// ---------------- CLUBS ----------------
function renderClubs(page){
  page.appendChild(el("h2",{class:"h2", text:"Clubs"}));
  page.appendChild(el("p",{class:"body-text", text: state.currentClub ? `Current club: ${state.currentClub}` : "You haven't joined a club yet."}));

  const available = state.clublist.filter(name => name !== state.currentClub);
  const monthsSinceJoin = state.currentClub ? state.monthIdx - (state.clubChangeMonth ?? state.monthIdx) : Infinity;
  const onCooldown = state.currentClub && monthsSinceJoin < 2;

  if (onCooldown){
    const remaining = 2 - monthsSinceJoin;
    page.appendChild(el("p",{class:"body-text muted", text:`You can switch clubs again in ${remaining} month${remaining===1?"":"s"}.`}));
  } else if (!available.length){
    page.appendChild(el("p",{class:"body-text muted", text:"No other clubs are running this month. Check back next month."}));
  } else {
    const stack = el("div",{class:"stack"});
    available.forEach(name=>{
      stack.appendChild(el("button",{class:"btn btn-stack", text:`Apply: ${name} club`, onclick:()=>{
        const { result: r, before, after } = runScaled(() => joinClub(state, name));
        if (r.log[0] && r.log[0].startsWith("Well done")){
          state.currentClub = name;
          state.clubChangeMonth = state.monthIdx;
        }
        logEvent(r.log);
        showModal(r.log, before, after);
      }}));
    });
    page.appendChild(stack);
  }
  page.appendChild(el("p",{class:"body-text muted", text:`Extra activities used this month: ${state.additioncounter}/5`}));
  page.appendChild(backButton());
}

// ---------------- FRIENDS ----------------
function renderFriends(page){
  page.appendChild(el("h2",{class:"h2", text:"Friends"}));
  const fc = friendCount();
  page.appendChild(el("p",{class:"body-text", text:`You currently have ${fc} friend${fc===1?"":"s"}.`}));
  page.appendChild(el("button",{class:"btn btn-stack", text:"Try to make a new friend", onclick:()=>{
    const { result: r, before, after } = runScaled(() => makeFriend(state));
    if (r.success){
      const candidates = state.characters.filter(ch => relationshipOf(ch.name) < 100);
      if (candidates.length){
        candidates.sort((a,b)=> relationshipOf(b.name) - relationshipOf(a.name));
        const pool = candidates.slice(0, 5);
        const winner = pick(pool);
        const boost = randInt(10, 20);
        state.relationships[winner.name] = Math.min(100, relationshipOf(winner.name) + boost);
        r.log.push(`You hit it off with ${winner.name} — you're getting closer!`);
      } else {
        r.log.push("You're already friends with everyone you know!");
      }
    }
    logEvent(r.log);
    showModal(r.log, before, after);
  }}));
  page.appendChild(el("div",{class:"divider"}));
  page.appendChild(el("p",{class:"body-text", text: state.cliqueDone ? `Your clique: ${state.cliqueName}` : "You haven't joined a clique yet — that happens in March."}));
  if (state.cliqueDone){
    const monthsSince = state.monthIdx - (state.cliqueChangeMonth ?? state.monthIdx);
    if (monthsSince >= 2){
      page.appendChild(el("button",{class:"btn btn-stack", text:"Change clique", onclick:()=>{
        state.cliqueMode = "change";
        goto("cliqueChoice");
      }}));
    } else {
      const remaining = 2 - monthsSince;
      page.appendChild(el("p",{class:"body-text muted", text:`You can change cliques again in ${remaining} month${remaining===1?"":"s"}.`}));
    }
  }
  page.appendChild(el("div",{class:"divider"}));
  page.appendChild(el("p",{class:"body-text", text:"Relationships — people with stats similar to yours grow closer over time."}));
  const list = el("div",{class:"roster-list"});
  state.characters.slice()
    .sort((a,b)=> relationshipOf(b.name) - relationshipOf(a.name))
    .forEach(ch=>{
      const rel = relationshipOf(ch.name);
      const isFriend = rel >= 100;
      const row = el("div",{class:"roster-row relationship-row"});
      row.appendChild(el("div",{class:"roster-icon", text:ch.name.charAt(0)}));
      const info = el("div",{class:"roster-info"});
      info.appendChild(el("div",{class:"roster-name-row"},[
        el("span",{class:"roster-name", text: ch.name + (isFriend ? " ★" : "")}),
        el("span",{class:"roster-form", text:ch.form}),
      ]));
      info.appendChild(relationshipBar(rel));
      row.appendChild(info);
      list.appendChild(row);
    });
  page.appendChild(list);
  page.appendChild(el("p",{class:"body-text muted", text:`Extra activities used this month: ${state.additioncounter}/5`}));
  page.appendChild(backButton());
}

function relationshipBar(value){
  const track = el("div",{class:"stat-bar-track relationship-track"});
  const fill = el("div",{class:"stat-bar-fill"});
  fill.style.width = Math.max(0,Math.min(100,value)) + "%";
  fill.style.background = statColor(value);
  track.appendChild(fill);
  return track;
}

// ---------------- GROWTH ----------------
function renderGrowth(page){
  page.appendChild(el("h2",{class:"h2", text:"Growth"}));
  page.appendChild(el("p",{class:"body-text", text:"Get extra help outside of class to sharpen your academics."}));
  page.appendChild(el("button",{class:"btn btn-stack", text:"Get subject help", onclick:()=>{
    const { result: r, before, after } = runScaled(() => extraStudy(state));
    logEvent(r.log);
    showModal(r.log, before, after);
  }}));
  page.appendChild(el("p",{class:"body-text muted", text:`Extra activities used this month: ${state.additioncounter}/5`}));
  page.appendChild(backButton());
}

// ---------------- STATS SECTION ----------------
function renderStatsSection(page){
  page.appendChild(el("h2",{class:"h2", text:"Stats"}));
  page.appendChild(el("button",{class:"btn btn-stack", text:"View class rankings", onclick:()=>{
    const r = rankings(state);
    state.pendingRankings = r.log;
    goto("rankingsView");
  }}));
  page.appendChild(el("p",{class:"body-text", text:"Tap a classmate to see their stats."}));
  const list = el("div",{class:"roster-list"});
  const population = [...state.characters, state.chosen];
  state.characters.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(ch=>{
    const row = el("div",{class:"roster-row", onclick:()=>{
      state.npcView = ch;
      goto("npcDetail");
    }});
    row.appendChild(el("div",{class:"roster-icon", text:ch.name.charAt(0)}));
    const info = el("div",{class:"roster-info"});
    info.appendChild(el("div",{class:"roster-name-row"},[
      el("span",{class:"roster-name", text:ch.name}),
      el("span",{class:"roster-form", text:ch.form}),
    ]));
    const starsRow = starLines(ch, population);
    info.appendChild(starsRow);
    row.appendChild(info);
    list.appendChild(row);
  });
  page.appendChild(list);
  page.appendChild(backButton());
}

function renderNpcDetail(page){
  const ch = state.npcView;
  page.appendChild(el("h2",{class:"h2", text:`${ch.name} — ${ch.form}`}));
  page.appendChild(statReport(ch));
  page.appendChild(backButton());
}

function renderRankingsView(page){
  page.appendChild(el("h2",{class:"h2", text:"Your class rankings"}));
  const box = el("div",{class:"result-box"});
  (state.pendingRankings||[]).forEach(line=>box.appendChild(el("p",{class:"result-text", text:line})));
  page.appendChild(box);
  page.appendChild(backButton());
}

// ---------------- YEAR END ----------------
function renderYearEnd(page){
  const c = state.chosen;
  page.appendChild(el("h2",{class:"h2", text:"Congratulations! You have survived your first year of ICHS."}));
  page.appendChild(statReport(c));
  page.appendChild(el("p",{class:"body-text", text:`Total detentions: ${state.detentions}`}));
  page.appendChild(el("p",{class:"body-text", text:`Clique: ${state.cliqueName || "None"}`}));
  page.appendChild(el("p",{class:"body-text", text:`Friends made: ${friendCount()}`}));
  page.appendChild(el("p",{class:"body-text muted", text:"Year 8 isn't wired up in this build yet — this covers Year 7 end to end."}));
  page.appendChild(el("button",{class:"btn btn-secondary", text:"Play again", onclick:()=>{
    location.reload();
  }}));
}

render();
