import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Faker,
  faker,
  fakerAF_ZA,
  fakerAR,
  fakerAZ,
  fakerCS_CZ,
  fakerDA,
  fakerDE,
  fakerDE_AT,
  fakerDE_CH,
  fakerEL,
  fakerEN_AU,
  fakerEN_CA,
  fakerEN_GB,
  fakerEN_GH,
  fakerEN_HK,
  fakerEN_IE,
  fakerEN_IN,
  fakerEN_NG,
  fakerEN_US,
  fakerEN_ZA,
  fakerES,
  fakerES_MX,
  fakerFA,
  fakerFI,
  fakerFR,
  fakerFR_BE,
  fakerFR_CA,
  fakerFR_CH,
  fakerHE,
  fakerHR,
  fakerHU,
  fakerID_ID,
  fakerIT,
  fakerJA,
  fakerKO,
  fakerNB_NO,
  fakerNL,
  fakerNL_BE,
  fakerPL,
  fakerPT_BR,
  fakerPT_PT,
  fakerRO,
  fakerRU,
  fakerSK,
  fakerSV,
  fakerTH,
  fakerTR,
  fakerUK,
  fakerVI,
  fakerZH_CN,
  fakerZH_TW,
} from '@faker-js/faker';
import { IUser } from '@/app/(mian)/_type';
import { getCountryLocale, getRandomPopulationCenter } from './population';
import {
  generateMemorableStrongPassword,
  generatePreferredEmail,
  generateReadablePhoneNumber,
} from './user-profile';
// 本地化 Faker 实例映射
const localeMap: Record<string, Faker> = {
  af_ZA: fakerAF_ZA,
  ar: fakerAR,
  az: fakerAZ,
  cs_CZ: fakerCS_CZ,
  da: fakerDA,
  de: fakerDE,
  de_AT: fakerDE_AT,
  de_CH: fakerDE_CH,
  el: fakerEL,
  en_AU: fakerEN_AU,
  en_CA: fakerEN_CA,
  en_GB: fakerEN_GB,
  en_GH: fakerEN_GH,
  en_HK: fakerEN_HK,
  en_IE: fakerEN_IE,
  en_IN: fakerEN_IN,
  en_NG: fakerEN_NG,
  en_US: fakerEN_US,
  en_ZA: fakerEN_ZA,
  es: fakerES,
  es_MX: fakerES_MX,
  fa: fakerFA,
  fi: fakerFI,
  fr: fakerFR,
  fr_BE: fakerFR_BE,
  fr_CA: fakerFR_CA,
  fr_CH: fakerFR_CH,
  he: fakerHE,
  hr: fakerHR,
  hu: fakerHU,
  id_ID: fakerID_ID,
  it: fakerIT,
  ja: fakerJA,
  ko: fakerKO,
  nb_NO: fakerNB_NO,
  nl: fakerNL,
  nl_BE: fakerNL_BE,
  pl: fakerPL,
  pt_BR: fakerPT_BR,
  pt_PT: fakerPT_PT,
  ro: fakerRO,
  ru: fakerRU,
  sk: fakerSK,
  sv: fakerSV,
  th: fakerTH,
  tr: fakerTR,
  uk: fakerUK,
  vi: fakerVI,
  zh_CN: fakerZH_CN,
  zh_TW: fakerZH_TW,
};

function withFakerFallback<T>(
  primary: () => T,
  fallback: () => T,
  finalValue: T
): T {
  try {
    return primary();
  } catch {
    try {
      return fallback();
    } catch {
      return finalValue;
    }
  }
}

export function getLocalfromCountryCode(countryCode: string): string {
  return getCountryLocale(countryCode);
}

/**
 * 根据地区码获取对应的Faker实例
 * @param countryCode 地区码（如：zh_CN, en_US等）
 * @returns 对应的Faker实例，如果找不到则返回默认的faker
 */
export function getLocaleFaker(countryCode: string): Faker {
  const locale = getLocalfromCountryCode(countryCode);
  return localeMap[locale] || fakerEN_US;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomCoor(countryCode?: string, radiusScale = 1) {
  const center = getRandomPopulationCenter(countryCode);
  const coordinates = faker.location.nearbyGPSCoordinate({
    isMetric: true,
    origin: center.origin,
    radius: Math.max(center.radius * radiusScale, 0.5),
  });
  return {
    coord: coordinates,
    country_code: center.countryCode,
  };
}

export function getPerson(country_code: string): IUser.asObject {
  const localFaker = getLocaleFaker(country_code);
  const firstname = withFakerFallback(
    () => localFaker.person.firstName(),
    () => fakerEN_US.person.firstName(),
    'Alex'
  );
  const lastname = withFakerFallback(
    () => localFaker.person.lastName(),
    () => fakerEN_US.person.lastName(),
    'Taylor'
  );
  const birthday = withFakerFallback(
    () =>
      localFaker.date
        .birthdate({ min: 18, max: 28, mode: 'age' })
        .toISOString()
        .split('T')[0],
    () =>
      fakerEN_US.date
        .birthdate({ min: 18, max: 28, mode: 'age' })
        .toISOString()
        .split('T')[0],
    '2000-01-01'
  );
  const street = withFakerFallback(
    () => localFaker.location.street(),
    () => fakerEN_US.location.street(),
    'Main Street'
  );
  const buildingNumber = withFakerFallback(
    () => localFaker.location.buildingNumber(),
    () => fakerEN_US.location.buildingNumber(),
    '100'
  );
  const zipcode = withFakerFallback(
    () => localFaker.location.zipCode(),
    () => fakerEN_US.location.zipCode(),
    '10001'
  );
  const gender = withFakerFallback(
    () => localFaker.person.gender(),
    () => fakerEN_US.person.gender(),
    'unknown'
  );
  const avatar = withFakerFallback(
    () => localFaker.image.avatarGitHub(),
    () => fakerEN_US.image.avatarGitHub(),
    ''
  );

  return {
    // idcard:localFaker.person.
    firstname,
    lastname,
    email: generatePreferredEmail(localFaker, firstname, lastname, birthday),
    phone: generateReadablePhoneNumber(localFaker, country_code),
    birthday,
    gender,
    avatar,
    password: generateMemorableStrongPassword(),
    display_name: '',
    generatedAt: new Date().toISOString(),
    address: {
      street,
      streetName: street,
      buildingNumber,
      city: '',
      district: '',
      zipcode,
      country: '',
      country_code: country_code,
      latitude: 0,
      longitude: 0,
      state: '',
    },
  };
}
// export async function getPersonAsync() {
//   try {
//     const re·sponse = await fetch(`https://fakerapi.it/api/v2/persons?_quantity=1&_birthday_start=2005-01-01&_locale=en_US`)
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
//     const data = await response.json()
//     return data
//   } catch (error) {
//     throw new Error(`Failed to fetch person data: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }
