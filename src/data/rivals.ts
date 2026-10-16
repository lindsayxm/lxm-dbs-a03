// Mock rivals for the leaderboard preview. Real players arrive with accounts next week.
// Monthly scores grow with the day of the month: correct = round(pace × day).

export type Rival = { username: string; pace: number; tokensPace: number };

export const RIVALS: Rival[] = [
  { username: "schrodingers_cat", pace: 0.95, tokensPace: 31 },
  { username: "heisenbug", pace: 0.82, tokensPace: 26 },
  { username: "quark_42", pace: 0.74, tokensPace: 29 },
  { username: "entangled_eve", pace: 0.66, tokensPace: 18 },
  { username: "planck_ton", pace: 0.58, tokensPace: 22 },
  { username: "dr_superposition", pace: 0.5, tokensPace: 15 },
  { username: "spooky_action", pace: 0.43, tokensPace: 17 },
  { username: "bohr_ing", pace: 0.36, tokensPace: 9 },
  { username: "qubit_queen", pace: 0.3, tokensPace: 12 },
  { username: "muon_mike", pace: 0.24, tokensPace: 6 },
  { username: "neutrino_nina", pace: 0.18, tokensPace: 7 },
  { username: "half_life", pace: 0.13, tokensPace: 3 },
  { username: "dark_matter_dan", pace: 0.09, tokensPace: 2 },
  { username: "fermi_paradox", pace: 0.05, tokensPace: 1 },
  { username: "wave_collapse", pace: 0.02, tokensPace: 0 },
];
