export const parseEnvToInt = (v: string | undefined, def: number) => {
  const n = Number(v);
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : def;
};
