import { populationCenters, type PopulationCenter } from './centers';

interface FeaturedCountryConfig {
  label: string;
  order: number;
}

export interface PopulationCountry {
  code: string;
  name: string;
  label: string;
  defaultLocale: string;
  centerCount: number;
  featured: boolean;
  order: number;
}

const FEATURED_COUNTRY_CONFIG: Partial<Record<string, FeaturedCountryConfig>> =
  {
    US: { label: '美国', order: 1 },
    CA: { label: '加拿大', order: 2 },
    HK: { label: '香港', order: 3 },
    JP: { label: '日本', order: 4 },
    // SG: { label: '新加坡', order: 5 },
  };

const populationCentersByCountry = new Map<string, PopulationCenter[]>();
const populationCountryMap = new Map<string, PopulationCountry>();

for (const center of populationCenters) {
  const code = center.countryCode.toUpperCase();
  const centers = populationCentersByCountry.get(code);

  if (centers) {
    centers.push(center);
  } else {
    populationCentersByCountry.set(code, [center]);
  }

  const existingCountry = populationCountryMap.get(code);

  if (existingCountry) {
    existingCountry.centerCount += 1;
    continue;
  }

  const featuredConfig = FEATURED_COUNTRY_CONFIG[code];
  const fallbackLabel = center.country;

  populationCountryMap.set(code, {
    code,
    name: center.country,
    label: featuredConfig?.label ?? fallbackLabel,
    defaultLocale: center.locale,
    centerCount: 1,
    featured: Boolean(featuredConfig),
    order: featuredConfig?.order ?? Number.MAX_SAFE_INTEGER,
  });
}

export const populationCountries = Array.from(
  populationCountryMap.values()
).sort((left, right) => left.name.localeCompare(right.name, 'en'));

export const featuredPopulationCountries = populationCountries
  .filter((country) => country.featured)
  .sort(
    (left, right) =>
      left.order - right.order || left.name.localeCompare(right.name, 'en')
  );

export function getPopulationCountry(countryCode: string) {
  return populationCountryMap.get(countryCode.toUpperCase());
}

export function getCountryLocale(countryCode: string) {
  return getPopulationCountry(countryCode)?.defaultLocale ?? 'en_US';
}

export function getPopulationCentersByCountry(countryCode: string) {
  return populationCentersByCountry.get(countryCode.toUpperCase()) ?? [];
}

export function getPopulationBoundsByCountry(countryCode: string) {
  const centers = getPopulationCentersByCountry(countryCode);

  if (centers.length === 0) {
    return null;
  }

  let minLat = centers[0].origin[0];
  let maxLat = centers[0].origin[0];
  let minLon = centers[0].origin[1];
  let maxLon = centers[0].origin[1];

  for (const center of centers) {
    minLat = Math.min(minLat, center.origin[0]);
    maxLat = Math.max(maxLat, center.origin[0]);
    minLon = Math.min(minLon, center.origin[1]);
    maxLon = Math.max(maxLon, center.origin[1]);
  }

  // 单城市国家/地区也给一个合理的概览范围，方便先“拉远”再飞向地址
  if (minLat === maxLat) {
    minLat -= 0.35;
    maxLat += 0.35;
  }

  if (minLon === maxLon) {
    minLon -= 0.35;
    maxLon += 0.35;
  }

  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ] as [[number, number], [number, number]];
}

export function getRandomPopulationCenter(countryCode?: string) {
  const filteredCenters = countryCode
    ? getPopulationCentersByCountry(countryCode)
    : populationCenters;
  const candidates =
    filteredCenters.length > 0 ? filteredCenters : populationCenters;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export { populationCenters };
export type { PopulationCenter };
