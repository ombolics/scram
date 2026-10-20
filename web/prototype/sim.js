/* SCRAM v0 toy plant model. Units: MW, MJ, K/degC, bar, s.
   Illustrative placeholder physics, NOT validated. Throwaway JS port of what will live in the Java `sim` module. */
const PNOM = 3000, PE_NOM = 1000, BETA = 0.0065, LAMBDA = 0.06;
const K_ROD = 0.06, R0 = 0.08, A_F = -3e-5, A_C = -1e-4, TF0 = 605, TC0 = 305;
const CF = 60, CC = 3000, H_FC = 10, UA_SG = 142.2, CS = 1500, UA_PASS = 0.6;
const DECAY = [{ a: 0.02, tau: 60 }, { a: 0.02, tau: 1200 }, { a: 0.01, tau: 20000 }];
const LIM = { fluxTrip: 1.15, tfTrip: 1000, pTrip: 80, mTrip: 0.9, damage: 1200, melt: 2000 };
const T_BOIL = 345, E_BOIL = 150000, E_SEC = 150000;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const tsat = p => 100 * Math.pow(Math.max(p, 0.1), 0.25);

function fmtTime(t) {
  t = Math.floor(t);
  const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function newPlant(tier, mode) {
  const s = {
    tier: tier || 2, t: 0, c: 1, n: 1, d: DECAY.map(x => x.a), Tf: 605, Tc: 305, p: 65,
    r: R0, rT: R0, auto: false, ei: 0, f: 1, fCmd: 1, D: 1000, v: 1, m: 1, Ms: 1, leak: 0,
    ac: true, makeup: false, tripped: false, tripReason: '', turbTrip: false, damage: 0, delivered: 0, shortfall: 0,
    Q: PNOM, Pe: PE_NOM, rho: 0, Qsg: PNOM, Qdump: 0, Qsv: 0, Qpass: 0, eccs: false, log: []
  };
  if (mode === 'standby') {
    s.n = s.c = 0.002; s.d = DECAY.map(x => x.a * 0.002);
    s.Tf = s.Tc = 285; s.p = 65; s.r = s.rT = 0.273; s.D = 0; s.v = 0; s.Q = 6; s.Pe = 0; s.Qsg = 6;
  }
  return s;
}

function logEv(s, msg, kind) { s.logCount = (s.logCount || 0) + 1; s.log.push({ id: s.logCount, t: s.t, msg, kind: kind || 'info' }); if (s.log.length > 60) s.log.shift(); }

function scram(s, why) {
  if (s.tripped) return;
  s.tripped = true; s.tripReason = why; s.auto = false;
  if (s.tier >= 2) s.turbTrip = true;
  logEv(s, 'REACTOR TRIP: ' + why, 'crit');
}

function resetTrip(s) {
  if (!s.tripped) return;
  s.tripped = false; s.tripReason = ''; s.turbTrip = false;
  logEv(s, 'Trip reset by operator', 'info');
}

function step(s, dt) {
  const ff = 0.05 + 0.95 * s.f;
  // pumps
  const fT = s.ac ? s.fCmd : 0;
  s.f += (fT - s.f) * dt / (s.ac ? 8 : 12);
  // control rods
  if (s.tripped) {
    s.r = Math.min(1, s.r + 0.8 * dt); s.rT = s.r;
  } else if (s.auto) {
    const Tref = 286 + 19 * Math.min(s.D, PE_NOM) / PE_NOM;
    const e = s.Tc - Tref;
    s.ei = clamp(s.ei + e * dt, -60, 60);
    const vel = clamp(0.0004 * e + 0.00001 * s.ei, -0.0015, 0.0015);
    s.r = clamp(s.r + vel * dt, 0, 1); s.rT = s.r;
  } else {
    s.r += clamp(s.rT - s.r, -0.006 * dt, 0.006 * dt);
  }
  // neutronics (one delayed group, prompt-jump approximation)
  const cov = clamp((s.m - 0.45) / 0.3, 0, 1);
  let rho = K_ROD * (R0 - s.r) + A_F * (s.Tf - TF0) + A_C * (s.Tc - TC0) - 0.05 * (1 - cov);
  rho = Math.min(rho, 0.85 * BETA);
  s.rho = rho;
  s.n = Math.max(1e-7, s.c * BETA / (BETA - rho));
  s.c = Math.max(1e-7, s.c + LAMBDA * s.c * rho / (BETA - rho) * dt);
  for (let i = 0; i < 3; i++) s.d[i] += (DECAY[i].a * s.n - s.d[i]) / DECAY[i].tau * dt;
  const Q = PNOM * (0.95 * s.n + s.d[0] + s.d[1] + s.d[2]);
  s.Q = Q;
  // primary / fuel
  const Qfc = H_FC * (0.1 + 0.9 * ff) * Math.max(cov, 0.003) * (s.Tf - s.Tc);
  const sgCov = clamp((s.m - 0.2) / 0.5, 0.05, 1) * clamp(s.Ms / 0.25, 0, 1);
  const Tsat = tsat(s.p);
  const Qsg = Math.min(3600 * ff, Math.max(0, UA_SG * (0.1 + 0.9 * Math.pow(ff, 0.8)) * sgCov * (s.Tc - Tsat)));
  s.Qsg = Qsg;
  s.Qpass = (s.tier >= 3 && s.tripped && s.m > 0.4) ? UA_PASS * Math.max(s.Tc - 40, 0) : 0;
  const eccsAvail = s.tier >= 2 && (s.ac || s.tier >= 3);
  s.eccs = eccsAvail && s.tripped && s.m < 0.88;
  const manual = s.makeup && s.ac && s.m < 1;
  const inj = s.eccs ? 0.006 : (manual ? 0.004 : 0);
  const Qeccs = inj * CC * 0.5 * Math.max(s.Tc - 40, 0);
  s.Tf += (Q - Qfc) / CF * dt;
  s.Tc += (Qfc - Qsg - s.Qpass - Qeccs) / (CC * Math.max(s.m, 0.35)) * dt;
  if (s.Tc > T_BOIL) {
    const excess = (s.Tc - T_BOIL) * CC * Math.max(s.m, 0.35);
    s.m = Math.max(0, s.m - excess / E_BOIL);
    s.Tc = T_BOIL;
  }
  s.m = clamp(s.m + (inj - s.leak) * dt, 0, 1);
  // turbine and secondary
  const vT = (!s.ac || s.turbTrip) ? 0 : clamp(s.D / (PE_NOM * (s.p / 65)), 0, 1);
  if (vT === 0) s.v = Math.max(0, s.v - 0.5 * dt); else s.v += clamp(vT - s.v, -0.1 * dt, 0.1 * dt);
  const Qt = s.v * PNOM * (s.p / 65);
  s.Pe = Qt / 3;
  s.Qdump = (s.ac && s.tier >= 2) ? clamp((s.p - 72) / 10, 0, 1) * 1200 * (s.p / 65) : 0;
  s.Qsv = clamp((s.p - 85) / 8, 0, 1) * PNOM * (s.p / 65);
  s.p = clamp(s.p + (Qsg - Qt - s.Qdump - s.Qsv) / CS * dt, 1, 200);
  s.Ms = clamp(s.Ms - s.Qsv / E_SEC * dt + (s.ac ? (1 - s.Ms) * 0.01 * dt : 0), 0, 1);
  // bookkeeping
  s.t += dt;
  s.delivered += s.Pe * dt / 3600 / 1000;
  s.shortfall = Math.max(0, s.D - s.Pe);
  // protection
  if (s.tier >= 2 && !s.tripped) {
    const qf = Q / PNOM;
    if (s.m < LIM.mTrip) scram(s, 'low coolant inventory');
    else if (qf > LIM.fluxTrip) scram(s, 'high neutron flux');
    else if (s.Tf > LIM.tfTrip) scram(s, 'high fuel temperature');
    else if (s.p > LIM.pTrip) scram(s, 'high steam pressure');
    else if (s.f < 0.4 && qf > 0.2) scram(s, 'low coolant flow');
    else if (!s.ac) scram(s, 'loss of AC power');
  }
  if (s.damage < 1 && s.Tf > LIM.damage) { s.damage = 1; logEv(s, 'FUEL DAMAGE: cladding failure, fission products released', 'crit'); }
  if (s.damage < 2 && s.Tf > LIM.melt) { s.damage = 2; logEv(s, 'CORE MELTDOWN', 'crit'); }
}

if (typeof module !== 'undefined') module.exports = { newPlant, step, scram, resetTrip, logEv, fmtTime, tsat, LIM, PNOM, PE_NOM, BETA };
