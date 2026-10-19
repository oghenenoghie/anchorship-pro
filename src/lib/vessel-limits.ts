// Plausibility limits shared by the vessel form (browser hints) and server-side validation. Generous by design: they catch typos, not edge cases.
export const VESSEL_LIMITS = { yearBuilt: { min: 1850, max: new Date().getFullYear() + 5 }, lengthMetres: { max: 500 }, breadthMetres: { max: 100 }, deadweightTonnes: { max: 700000 }, specs: { max: 40, label: 80, value: 200 } } as const;
