import type { QueryClient } from '@tanstack/react-query';
import { getCoorAddress } from '../_api';
import type { IUser } from '../_type';
import { normalizeReverseGeocodeAddress } from '@/lib/user-profile';
import { getRandomCoor, type RandomCoordinateTarget } from '@/lib/utils';

const RANDOM_COORDINATE_RADIUS_SCALES = [0.2, 0.35, 0.55, 0.8];
const ATTEMPTS_PER_RADIUS_SCALE = 2;
const MIN_STREET_LEVEL_PLACE_RANK = 26;
const MAX_REVERSE_MATCH_DISTANCE_METERS = 350;
const MAX_COORD_SNAP_DISTANCE_METERS = 1800;
const REQUEST_SPACING_MS = 350;

export const REVERSE_GEOCODE_STALE_TIME = 60 * 1000;

const WATER_CATEGORIES = new Set(['natural', 'waterway']);
const WATER_TYPES = new Set([
  'basin',
  'bay',
  'canal',
  'coastline',
  'dock',
  'harbour',
  'lake',
  'ocean',
  'reservoir',
  'river',
  'sea',
  'sound',
  'strait',
  'water',
  'wetland',
]);
const WATER_ADDRESSTYPES = new Set([
  'bay',
  'coastline',
  'harbour',
  'ocean',
  'sea',
  'sound',
  'strait',
  'water',
]);
const LOCALITY_FIELDS: Array<keyof IUser.getCoorAddressResponse['address']> = [
  'borough',
  'city',
  'city_district',
  'county',
  'hamlet',
  'municipality',
  'neighbourhood',
  'quarter',
  'suburb',
  'town',
  'village',
];
const COARSE_TYPES = new Set([
  'administrative',
  'archipelago',
  'city',
  'continent',
  'country',
  'county',
  'district',
  'hamlet',
  'island',
  'islet',
  'locality',
  'municipality',
  'neighbourhood',
  'province',
  'quarter',
  'region',
  'state',
  'suburb',
  'town',
  'village',
]);
const COARSE_ADDRESSTYPES = new Set([
  'city',
  'country',
  'county',
  'district',
  'hamlet',
  'municipality',
  'neighbourhood',
  'postcode',
  'quarter',
  'state',
  'suburb',
  'town',
  'village',
]);

export interface RandomAddressGenerationResult {
  coord: [number, number];
  country_code: string;
  reverse: IUser.getCoorAddressResponse | null;
}

export interface RandomAddressGenerationProgress {
  attempt: number;
  totalAttempts: number;
  radiusScale: number;
  countryCode?: string;
}

export function getReverseQueryKey(
  coord: [number, number],
  countryCode?: string
) {
  return ['getCoorAddress', coord[0], coord[1], countryCode ?? ''] as const;
}

function getTargetCountryCode(target?: string | RandomCoordinateTarget) {
  return typeof target === 'string' ? target : target?.countryCode;
}

function normalizeCountryCode(countryCode?: string) {
  return countryCode?.trim().toUpperCase() ?? '';
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDistanceMeters(start: [number, number], end: [number, number]) {
  const earthRadiusMeters = 6371000;
  const deltaLat = toRadians(end[0] - start[0]);
  const deltaLon = toRadians(end[1] - start[1]);
  const startLat = toRadians(start[0]);
  const endLat = toRadians(end[0]);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hasLocalityContext(address: IUser.getCoorAddressResponse['address']) {
  return (
    LOCALITY_FIELDS.some((field) => Boolean(address[field]?.trim())) ||
    Boolean(address.postcode?.trim())
  );
}

function hasStreetLevelAddress(
  address: IUser.getCoorAddressResponse['address']
) {
  return Boolean(address.road?.trim()) && hasLocalityContext(address);
}

function isWaterLike(result: IUser.getCoorAddressResponse) {
  return (
    WATER_CATEGORIES.has(result.category) ||
    WATER_TYPES.has(result.type) ||
    WATER_ADDRESSTYPES.has(result.addresstype)
  );
}

function isCoarseAreaResult(result: IUser.getCoorAddressResponse) {
  return (
    COARSE_TYPES.has(result.type) || COARSE_ADDRESSTYPES.has(result.addresstype)
  );
}

function getResolvedReverseCoord(result: IUser.getCoorAddressResponse) {
  return [Number(result.lat), Number(result.lon)] as [number, number];
}

function resolveValidatedCoord(
  requestedCoord: [number, number],
  result: IUser.getCoorAddressResponse,
  expectedCountryCode?: string
) {
  const responseCountryCode = normalizeCountryCode(result.address.country_code);
  const normalizedExpectedCountryCode =
    normalizeCountryCode(expectedCountryCode);

  if (!responseCountryCode) {
    return null;
  }

  if (
    normalizedExpectedCountryCode &&
    responseCountryCode !== normalizedExpectedCountryCode
  ) {
    return null;
  }

  if (
    isWaterLike(result) ||
    isCoarseAreaResult(result) ||
    result.place_rank < MIN_STREET_LEVEL_PLACE_RANK ||
    !hasStreetLevelAddress(result.address)
  ) {
    return null;
  }

  const reverseCoord = getResolvedReverseCoord(result);
  const distanceMeters = getDistanceMeters(requestedCoord, reverseCoord);

  if (distanceMeters <= MAX_REVERSE_MATCH_DISTANCE_METERS) {
    return requestedCoord;
  }

  if (distanceMeters <= MAX_COORD_SNAP_DISTANCE_METERS) {
    return reverseCoord;
  }

  return null;
}

export function hydrateUserWithReverseGeocode(
  user: IUser.asObject,
  result: IUser.getCoorAddressResponse
) {
  return {
    ...user,
    display_name: result.display_name,
    address: {
      ...user.address,
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      ...normalizeReverseGeocodeAddress(result.address, user.address),
    },
  };
}

export async function generateValidatedRandomAddress(
  queryClient: QueryClient,
  target?: string | RandomCoordinateTarget,
  onProgress?: (progress: RandomAddressGenerationProgress) => void
): Promise<RandomAddressGenerationResult> {
  let lastError: unknown = null;
  const totalAttempts =
    RANDOM_COORDINATE_RADIUS_SCALES.length * ATTEMPTS_PER_RADIUS_SCALE;
  let currentAttempt = 0;
  const targetCountryCode = getTargetCountryCode(target);

  for (const radiusScale of RANDOM_COORDINATE_RADIUS_SCALES) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_RADIUS_SCALE; attempt += 1) {
      currentAttempt += 1;
      onProgress?.({
        attempt: currentAttempt,
        totalAttempts,
        radiusScale,
        countryCode: targetCountryCode,
      });
      const candidate = getRandomCoor(target, radiusScale);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: getReverseQueryKey(candidate.coord, candidate.country_code),
          queryFn: () =>
            getCoorAddress({
              lat: candidate.coord[0],
              lon: candidate.coord[1],
              'accept-language': candidate.country_code,
            }),
          staleTime: REVERSE_GEOCODE_STALE_TIME,
          retry: false,
        });
        const resolvedCoord = resolveValidatedCoord(
          candidate.coord,
          response.data,
          candidate.country_code
        );

        if (!resolvedCoord) {
          continue;
        }

        if (
          resolvedCoord[0] !== candidate.coord[0] ||
          resolvedCoord[1] !== candidate.coord[1]
        ) {
          queryClient.setQueryData(
            getReverseQueryKey(resolvedCoord, candidate.country_code),
            response
          );
        }

        return {
          coord: resolvedCoord,
          country_code: candidate.country_code,
          reverse: response.data,
        };
      } catch (error) {
        lastError = error;
      }

      if (currentAttempt < totalAttempts) {
        await sleep(REQUEST_SPACING_MS);
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  if (lastError) {
    throw new Error('随机地址校验失败');
  }

  const fallback = getRandomCoor(target, 0.2);
  return {
    coord: fallback.coord,
    country_code: fallback.country_code,
    reverse: null,
  };
}
