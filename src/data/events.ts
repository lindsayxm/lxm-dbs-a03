// Seeded, fictional events. Each one repeats weekly: a new "trial" opens the moment
// the previous one closes. Close times are offsets from the player's first visit,
// so every new player sees some events close within the first day.

export const CATEGORIES = ["sports", "politics", "world", "markets", "culture", "science"] as const;
export type Category = (typeof CATEGORIES)[number];

export type EventTemplate = {
  id: string;
  category: Category;
  title: string;
  blurb: string;
  options: string[];
  /** Crowd split in percent, same order as options. Also weights the hidden outcome. */
  crowd: number[];
  /** Hours after the first visit when trial #1 closes. Later trials follow every 7 days. */
  closesAfterHours: number;
};

export const EVENTS: EventTemplate[] = [
  // Sports
  { id: "comets-peaks", category: "sports", title: "Chicago Comets vs. Denver Peaks: who wins Sunday's game?", blurb: "The Comets are 6–1 at home. The Peaks haven't lost on the road since August.", options: ["Comets", "Peaks"], crowd: [64, 36], closesAfterHours: 20 },
  { id: "lakeshore-marathon", category: "sports", title: "Will the Lakeshore Marathon winner finish under 2:06?", blurb: "Flat course, cool forecast, and three runners with sub-2:05 personal bests.", options: ["Yes", "No"], crowd: [30, 70], closesAfterHours: 72 },
  { id: "riverside-harbor", category: "sports", title: "Riverside FC vs. Harbor United: what's the result?", blurb: "A derby that has ended level in three of the last five meetings.", options: ["Riverside win", "Draw", "Harbor win"], crowd: [45, 25, 30], closesAfterHours: 48 },
  { id: "coastal-open", category: "sports", title: "Who takes the Coastal Open final: Okafor or Lindqvist?", blurb: "Okafor's serve against Lindqvist's return game. Their head-to-head is 3–3.", options: ["Okafor", "Lindqvist"], crowd: [55, 45], closesAfterHours: 120 },

  // Politics
  { id: "metro-transit", category: "politics", title: "Will the Metro City council pass the free-transit pilot?", blurb: "The vote needs 8 of 15. Five members are publicly undecided.", options: ["Passes", "Fails"], crowd: [58, 42], closesAfterHours: 30 },
  { id: "fairview-turnout", category: "politics", title: "Will turnout in the Fairview mayoral race top 40%?", blurb: "The last off-cycle race drew 31%. Early voting is running ahead of pace.", options: ["Yes", "No"], crowd: [35, 65], closesAfterHours: 96 },
  { id: "ashford-debate", category: "politics", title: "Who will snap polls say won the Ashford governor debate?", blurb: "Ramos leads on the economy, Whitfield on schools. One night, ninety minutes.", options: ["Ramos", "Whitfield"], crowd: [50, 50], closesAfterHours: 12 },
  { id: "lakeview-recall", category: "politics", title: "Will the Lakeview recall petition gather enough signatures?", blurb: "Organizers need 12,000 valid signatures by the deadline. They claim 10,400.", options: ["Qualifies", "Falls short"], crowd: [40, 60], closesAfterHours: 150 },

  // World
  { id: "nordhaven-summit", category: "world", title: "Will the Nordhaven climate summit end with a signed agreement?", blurb: "Negotiators have a draft. Two delegations are still objecting to the text.", options: ["Signed", "No deal"], crowd: [62, 38], closesAfterHours: 60 },
  { id: "mount-taral", category: "world", title: "Will Mount Taral's alert level be raised this week?", blurb: "Seismic activity is up, but gas readings are holding steady.", options: ["Raised", "Unchanged"], crowd: [20, 80], closesAfterHours: 140 },
  { id: "strait-bridge", category: "world", title: "Will the Strait Bridge reopen on schedule?", blurb: "Repairs are 90% complete, according to the transport ministry.", options: ["On schedule", "Delayed"], crowd: [70, 30], closesAfterHours: 36 },
  { id: "aurora-launch", category: "world", title: "Will the Aurora-3 weather satellite launch in its first window?", blurb: "The rocket is fueled. Upper-level winds are the only question.", options: ["Launches", "Scrubbed"], crowd: [55, 45], closesAfterHours: 6 },

  // Markets
  { id: "global-500", category: "markets", title: "Will the Global 500 index close the week higher?", blurb: "Up four weeks in a row. Earnings season starts Tuesday.", options: ["Higher", "Lower"], crowd: [57, 43], closesAfterHours: 110 },
  { id: "coffee-futures", category: "markets", title: "Will coffee futures close above $4/lb by Friday?", blurb: "Dry weather in growing regions has pushed prices up 12% this month.", options: ["Above $4", "At or below $4"], crowd: [33, 67], closesAfterHours: 84 },
  { id: "brightloop-ipo", category: "markets", title: "Will the Brightloop IPO price above its range?", blurb: "Bankers say the order book is \"several times\" oversubscribed.", options: ["Above range", "In or below range"], crowd: [48, 52], closesAfterHours: 24 },
  { id: "central-reserve", category: "markets", title: "What will the Central Reserve do with interest rates?", blurb: "Inflation is cooling, and so is hiring. The committee meets Wednesday.", options: ["Hold", "Cut", "Hike"], crowd: [70, 22, 8], closesAfterHours: 160 },

  // Culture
  { id: "quiet-orbit-box-office", category: "culture", title: "Will \"Quiet Orbit\" top the weekend box office?", blurb: "Strong reviews, a crowded weekend, and a superhero sequel in its second week.", options: ["Number one", "Not number one"], crowd: [52, 48], closesAfterHours: 54 },
  { id: "juniper-vale-album", category: "culture", title: "Will Juniper Vale's new album debut at #1?", blurb: "Her last two albums both debuted at #2.", options: ["Debuts at #1", "Lower"], crowd: [66, 34], closesAfterHours: 100 },
  { id: "lumen-awards", category: "culture", title: "Which film wins Best Picture at the Lumen Awards?", blurb: "Three frontrunners, and the critics' groups have split.", options: ["Quiet Orbit", "The Long Field", "Paper Saints"], crowd: [40, 35, 25], closesAfterHours: 168 },
  { id: "harbor-lights", category: "culture", title: "Will \"Harbor Lights\" be renewed for a third season?", blurb: "Ratings are down, but its streaming numbers doubled after the finale.", options: ["Renewed", "Cancelled"], crowd: [60, 40], closesAfterHours: 18 },

  // Science
  { id: "asteroid-flyby", category: "science", title: "Will asteroid 2026 QX pass closer than the Moon?", blurb: "The current estimate puts the flyby just outside one lunar distance.", options: ["Closer", "Farther"], crowd: [25, 75], closesAfterHours: 44 },
  { id: "halvorsen-fusion", category: "science", title: "Will the Halvorsen Lab publish its fusion run results this week?", blurb: "A preprint has been \"imminent\" for nine days.", options: ["Published", "Not yet"], crowd: [45, 55], closesAfterHours: 130 },
  { id: "comet-marisol", category: "science", title: "Will Comet Marisol be visible to the naked eye?", blurb: "It's brightening faster than models predicted. Or it might break apart.", options: ["Visible", "Telescope only"], crowd: [30, 70], closesAfterHours: 90 },
  { id: "qubit-record", category: "science", title: "Will any lab announce a 2,000-qubit processor this week?", blurb: "The current record is 1,180. Two labs have press events scheduled.", options: ["Announced", "Not this week"], crowd: [15, 85], closesAfterHours: 66 },
];

export function getTemplate(id: string) {
  return EVENTS.find((e) => e.id === id);
}
