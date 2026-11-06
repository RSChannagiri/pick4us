// Pure pick logic, kept separate from Convex so it can be tested by hand.

export type Restaurant = {
  name: string;
  cuisines: string[];
  dietary: string[];
  price: number;
};

export type Response = {
  name: string;
  cravings: string[];
  limits: string[];
  budget: number;
};

export type Pick = {
  pick: Restaurant | null;
  backup: Restaurant | null;
  reason: string;
};

export function choose(restaurants: Restaurant[], responses: Response[]): Pick {
  if (responses.length === 0) {
    return { pick: null, backup: null, reason: "Waiting for someone to respond." };
  }

  // 1. Every limit anyone listed must be on the place's dietary list.
  const allLimits = [...new Set(responses.flatMap((r) => r.limits))];
  // 2. Nobody pays more than the lowest budget in the group.
  const maxPrice = Math.min(...responses.map((r) => r.budget));

  const fits = restaurants.filter(
    (place) =>
      allLimits.every((limit) => place.dietary.includes(limit)) &&
      place.price <= maxPrice,
  );

  if (fits.length === 0) {
    return {
      pick: null,
      backup: null,
      reason: "No place fits everyone's limits and budget. Try relaxing a limit or raising the budget.",
    };
  }

  // 3. One point per person craving any of the place's cuisines.
  const points = (place: Restaurant) =>
    responses.filter((r) => r.cravings.some((c) => place.cuisines.includes(c))).length;

  // 4. Most points first, then cheaper, then by name, so ties never flip.
  const ranked = fits
    .map((place) => ({ place, score: points(place) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.place.price - b.place.price ||
        a.place.name.localeCompare(b.place.name),
    );

  const top = ranked[0];
  const backup = ranked[1]?.place ?? null;

  // 6. Build the reason from the real numbers.
  const total = responses.length;
  const fitText = allLimits.length > 0 ? "Fits everyone's limits" : "Fits everyone's budget";
  let reason: string;
  if (top.score === 0) {
    reason = `${fitText}. Nobody's cravings matched, so this is the cheapest fit.`;
  } else {
    const craved = top.place.cuisines.find((c) =>
      responses.some((r) => r.cravings.includes(c)),
    );
    reason = `${fitText}, and ${top.score} of ${total} ${total === 1 ? "person is" : "people are"} craving ${craved}.`;
  }

  return { pick: top.place, backup, reason };
}
