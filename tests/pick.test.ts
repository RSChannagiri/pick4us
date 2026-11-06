// Run with: npx tsx tests/pick.test.ts
import { choose, Restaurant, Response } from "../convex/pickLogic";

const places: Restaurant[] = [
  { name: "Taco Spot", cuisines: ["mexican"], dietary: ["vegetarian"], price: 1 },
  { name: "Burrito Bar", cuisines: ["mexican"], dietary: ["vegetarian", "vegan"], price: 2 },
  { name: "Pho House", cuisines: ["vietnamese"], dietary: ["vegetarian"], price: 1 },
  { name: "Steak Co", cuisines: ["american"], dietary: [], price: 3 },
  { name: "Halal Grill", cuisines: ["mediterranean"], dietary: ["halal", "vegetarian"], price: 2 },
];

const p = (name: string, cravings: string[], limits: string[], budget: number): Response => ({ name, cravings, limits, budget });

function check(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : `\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`}`);
  if (!ok) process.exitCode = 1;
}

// Paper example: three people, five places.
// Limits: vegetarian. Lowest budget: 2. Left: Taco Spot, Burrito Bar, Pho House, Halal Grill.
// Points: Taco 2 (A, B), Burrito 2 (A, B), Pho 1 (C), Halal 0. Tie on 2 -> cheaper Taco Spot.
let r = choose(places, [p("A", ["mexican"], ["vegetarian"], 2), p("B", ["mexican"], [], 3), p("C", ["vietnamese"], [], 2)]);
check("paper example pick", r.pick?.name, "Taco Spot");
check("paper example backup", r.backup?.name, "Burrito Bar");
check("paper example reason", r.reason, "Fits everyone's limits, and 2 of 3 people are craving mexican.");

// One vegan, and the only vegan place is over budget.
r = choose(places, [p("A", [], ["vegan"], 1)]);
check("vegan with no fit", r.pick, null);

// Nobody has cravings: cheapest fit wins, alphabetical tiebreak.
r = choose(places, [p("A", [], [], 3), p("B", [], [], 3)]);
check("no cravings pick", r.pick?.name, "Pho House");
check("no cravings backup", r.backup?.name, "Taco Spot");

// Only one person responded.
r = choose(places, [p("A", ["american"], [], 3)]);
check("one person pick", r.pick?.name, "Steak Co");
check("one person reason", r.reason, "Fits everyone's budget, and 1 of 1 person is craving american.");

// Only one place left, so no backup.
r = choose(places, [p("A", [], ["halal"], 3)]);
check("one place left pick", r.pick?.name, "Halal Grill");
check("one place left backup", r.backup, null);

// Nobody yet.
check("no responses", choose(places, []).pick, null);
