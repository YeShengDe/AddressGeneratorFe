import { faker, type Faker } from '@faker-js/faker';
import { differenceInYears, format, isValid, parseISO } from 'date-fns';
import type { Address, IUser } from '@/app/(mian)/_type';

interface PhoneFormatConfig {
  dialCode: string;
  groups: number[];
}

interface AddressMetaConfig {
  cityLabel: string;
  districtLabel: string;
  stateLabel: string;
  zipcodeLabel: string;
}

const EAST_ASIAN_COUNTRIES = new Set(['CN', 'TW', 'HK', 'JP', 'KR']);
const NAME_WITHOUT_SPACE_COUNTRIES = new Set(['CN', 'TW', 'JP']);
const EMAIL_DOMAINS = ['gmail.com', 'outlook.com'] as const;
const PASSWORD_WORDS = [
  'amber',
  'atlas',
  'beacon',
  'cedar',
  'coral',
  'cosmo',
  'ember',
  'fable',
  'forest',
  'harbor',
  'lunar',
  'mango',
  'maple',
  'meadow',
  'nova',
  'olive',
  'otter',
  'pearl',
  'river',
  'sable',
  'solar',
  'spruce',
  'summit',
  'sunny',
  'velvet',
  'willow',
] as const;
const PHONE_FORMATS: Partial<Record<string, PhoneFormatConfig>> = {
  AU: { dialCode: '61', groups: [3, 3, 3] },
  BR: { dialCode: '55', groups: [2, 5, 4] },
  CA: { dialCode: '1', groups: [3, 3, 4] },
  CN: { dialCode: '86', groups: [3, 4, 4] },
  DE: { dialCode: '49', groups: [3, 3, 4] },
  ES: { dialCode: '34', groups: [3, 3, 3] },
  FR: { dialCode: '33', groups: [1, 2, 2, 2, 2] },
  GB: { dialCode: '44', groups: [4, 3, 4] },
  HK: { dialCode: '852', groups: [4, 4] },
  IN: { dialCode: '91', groups: [5, 5] },
  IT: { dialCode: '39', groups: [3, 3, 4] },
  JP: { dialCode: '81', groups: [2, 4, 4] },
  KR: { dialCode: '82', groups: [2, 4, 4] },
  MX: { dialCode: '52', groups: [3, 3, 4] },
  SG: { dialCode: '65', groups: [4, 4] },
  TW: { dialCode: '886', groups: [3, 3, 3] },
  US: { dialCode: '1', groups: [3, 3, 4] },
};
const DEFAULT_ADDRESS_META: AddressMetaConfig = {
  stateLabel: '地区',
  cityLabel: '城市',
  districtLabel: '区/县',
  zipcodeLabel: '邮编',
};
const ADDRESS_META_BY_COUNTRY: Partial<Record<string, AddressMetaConfig>> = {
  AU: {
    stateLabel: '州/领地',
    cityLabel: '城市',
    districtLabel: '地区',
    zipcodeLabel: '邮编',
  },
  CA: {
    stateLabel: '省',
    cityLabel: '城市',
    districtLabel: '地区',
    zipcodeLabel: '邮编',
  },
  CN: {
    stateLabel: '省/直辖市',
    cityLabel: '城市',
    districtLabel: '区/县',
    zipcodeLabel: '邮编',
  },
  HK: {
    stateLabel: '地区',
    cityLabel: '城市',
    districtLabel: '分区',
    zipcodeLabel: '邮编',
  },
  JP: {
    stateLabel: '都道府县',
    cityLabel: '市区',
    districtLabel: '地区',
    zipcodeLabel: '邮编',
  },
  KR: {
    stateLabel: '道/广域市',
    cityLabel: '城市',
    districtLabel: '区/郡',
    zipcodeLabel: '邮编',
  },
  SG: {
    stateLabel: '地区',
    cityLabel: '城市',
    districtLabel: '片区',
    zipcodeLabel: '邮编',
  },
  TW: {
    stateLabel: '县市',
    cityLabel: '城市',
    districtLabel: '区',
    zipcodeLabel: '邮编',
  },
  US: {
    stateLabel: '州',
    cityLabel: '城市',
    districtLabel: '县/区',
    zipcodeLabel: 'ZIP',
  },
};

type AddressMetaItem = {
  key: 'state' | 'city' | 'district' | 'zipcode';
  label: string;
  value: string;
};

type ReverseAddress = NonNullable<IUser.getCoorAddressResponse['address']>;

function capitalizeWord(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function normalizeCountryCode(countryCode?: string) {
  return countryCode?.toUpperCase() ?? '';
}

function containsEastAsianScript(value: string) {
  return /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]/.test(value);
}

function sanitizeEmailLocalPart(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '');
}

function normalizeLocalizedAddressValue(
  value: string | undefined,
  countryCode?: string
) {
  const trimmed = value?.replace(/\s+/g, ' ').trim() ?? '';

  if (!trimmed) {
    return '';
  }

  const normalizedCountryCode = normalizeCountryCode(countryCode);

  if (
    normalizedCountryCode !== 'HK' ||
    !containsEastAsianScript(trimmed) ||
    !/[A-Za-z]/.test(trimmed)
  ) {
    return trimmed;
  }

  const cleaned = trimmed
    .replace(/\b[A-Za-z][A-Za-z\s.'&/-]*\b/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*(,|，|·|\.)\s*/g, '')
    .replace(/\s+(?=[\u3400-\u9fff\uf900-\ufaff])/g, '')
    .replace(/(?<=[\u3400-\u9fff\uf900-\ufaff])\s+/g, '')
    .trim();

  return cleaned || trimmed;
}

function trimOrPadDigits(value: string, length: number) {
  if (value.length >= length) {
    return value.slice(-length);
  }

  return `${value}${faker.string.numeric(length - value.length)}`;
}

function groupDigits(value: string, groups: number[]) {
  const formatted: string[] = [];
  let cursor = 0;

  for (const groupSize of groups) {
    const chunk = value.slice(cursor, cursor + groupSize);

    if (!chunk) {
      break;
    }

    formatted.push(chunk);
    cursor += groupSize;
  }

  if (cursor < value.length) {
    formatted.push(value.slice(cursor));
  }

  return formatted.join(' ');
}

function fallbackPhoneGrouping(value: string) {
  if (value.length <= 4) {
    return value;
  }

  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const remaining = value.length - cursor;
    const chunkSize = remaining > 7 ? 3 : 4;
    chunks.push(value.slice(cursor, cursor + chunkSize));
    cursor += chunkSize;
  }

  return chunks.join(' ');
}

function isEastAsianName(
  user: Pick<IUser.asObject, 'firstname' | 'lastname' | 'address'>
) {
  const countryCode = normalizeCountryCode(user.address?.country_code);
  const fullName = `${user.firstname ?? ''}${user.lastname ?? ''}`;
  return (
    EAST_ASIAN_COUNTRIES.has(countryCode) || containsEastAsianScript(fullName)
  );
}

function buildStreetLine(address: Address) {
  const countryCode = normalizeCountryCode(address.country_code);
  const streetName = normalizeLocalizedAddressValue(
    address.streetName?.trim() || address.street?.trim(),
    countryCode
  );
  const rawBuildingNumber = address.buildingNumber?.trim();
  const buildingNumber =
    countryCode === 'CN' &&
    rawBuildingNumber &&
    /^[0-9A-Za-z-]+$/.test(rawBuildingNumber) &&
    !/[号弄室栋]/.test(rawBuildingNumber)
      ? `${rawBuildingNumber}号`
      : rawBuildingNumber;

  if (NAME_WITHOUT_SPACE_COUNTRIES.has(countryCode)) {
    return [streetName, buildingNumber].filter(Boolean).join('');
  }

  return [buildingNumber, streetName].filter(Boolean).join(' ');
}

function pickFirst(...values: Array<string | undefined>) {
  for (const value of values) {
    const normalized = value?.trim();

    if (normalized) {
      return normalized;
    }
  }

  return '';
}

function uniqueParts(values: Array<string | undefined>) {
  const usedValues = new Set<string>();

  return values.filter((value) => {
    const normalized = value?.trim();

    if (!normalized || usedValues.has(normalized)) {
      return false;
    }

    usedValues.add(normalized);
    return true;
  });
}

function pickAddressMetaConfig(countryCode?: string) {
  return (
    ADDRESS_META_BY_COUNTRY[normalizeCountryCode(countryCode)] ??
    DEFAULT_ADDRESS_META
  );
}

export function generatePreferredEmail(
  localFaker: Faker,
  firstName: string,
  lastName: string,
  birthday: string
) {
  const first = sanitizeEmailLocalPart(firstName);
  const last = sanitizeEmailLocalPart(lastName);
  const initials = `${first.slice(0, 1)}${last.slice(0, 1)}`;
  const variants = [
    `${first}.${last}`,
    `${first}${last}`,
    `${first}_${last}`,
    `${first}${birthday.slice(2, 4)}`,
    `${first}${last.slice(0, 1)}${birthday.slice(5, 7)}`,
    `${first}${localFaker.string.numeric(2)}`,
    `${initials}${birthday.slice(2, 4)}${localFaker.string.numeric(2)}`,
  ]
    .map((value) => sanitizeEmailLocalPart(value))
    .filter(Boolean)
    .filter((value) => value.length >= 4 && value.length <= 18);
  const localPart =
    variants.length > 0
      ? localFaker.helpers.arrayElement(variants)
      : `user${localFaker.string.numeric(4)}`;
  const domain = localFaker.helpers.arrayElement(EMAIL_DOMAINS);

  return `${localPart}@${domain}`;
}

export function generateMemorableStrongPassword() {
  const firstWord = faker.helpers.arrayElement(PASSWORD_WORDS);
  let secondWord = faker.helpers.arrayElement(PASSWORD_WORDS);

  while (secondWord === firstWord) {
    secondWord = faker.helpers.arrayElement(PASSWORD_WORDS);
  }

  const digits = faker.string.numeric(2);
  const symbol = faker.helpers.arrayElement(['!', '@', '#', '$', '%']);

  return `${capitalizeWord(firstWord)}${digits}${symbol}${capitalizeWord(secondWord)}`;
}

export function generateReadablePhoneNumber(
  localFaker: Faker,
  countryCode: string
) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const config = PHONE_FORMATS[normalizedCountryCode];
  let rawPhone = '';

  try {
    rawPhone = localFaker.phone.number({ style: 'international' });
  } catch {
    rawPhone = `${config ? `+${config.dialCode} ` : '+'}${faker.string.numeric(10)}`;
  }

  const digits = rawPhone.replace(/\D/g, '');

  if (!config) {
    if (rawPhone.startsWith('+')) {
      const prefixLength = Math.min(Math.max(digits.length - 10, 1), 3);
      const dialCode = digits.slice(0, prefixLength);
      const national = digits.slice(prefixLength);
      return `+${dialCode} ${fallbackPhoneGrouping(national)}`.trim();
    }

    return rawPhone.replace(/\s+/g, ' ').trim();
  }

  const nationalLength = config.groups.reduce((sum, size) => sum + size, 0);
  let nationalDigits = digits;

  if (rawPhone.startsWith('+') && digits.startsWith(config.dialCode)) {
    nationalDigits = digits.slice(config.dialCode.length);
  }

  nationalDigits = trimOrPadDigits(
    nationalDigits.replace(/^0+/, ''),
    nationalLength
  );

  return `+${config.dialCode} ${groupDigits(nationalDigits, config.groups)}`;
}

export function formatPersonName(
  user: Pick<IUser.asObject, 'firstname' | 'lastname' | 'address'>
) {
  const firstName = user.firstname?.trim();
  const lastName = user.lastname?.trim();

  if (!firstName && !lastName) {
    return '';
  }

  if (!isEastAsianName(user)) {
    return [firstName, lastName].filter(Boolean).join(' ');
  }

  const countryCode = normalizeCountryCode(user.address?.country_code);
  const separator = NAME_WITHOUT_SPACE_COUNTRIES.has(countryCode) ? '' : ' ';

  return [lastName, firstName].filter(Boolean).join(separator);
}

export function formatAddressPrimaryLine(address: Address) {
  const countryCode = normalizeCountryCode(address.country_code);
  const streetLine = buildStreetLine(address);

  if (countryCode === 'CN') {
    return (
      uniqueParts([address.state, address.city, address.district]).join('') +
      streetLine
    );
  }

  if (countryCode === 'HK') {
    const hkParts = uniqueParts([
      address.city === '香港' ? undefined : address.city,
      address.district,
    ]);

    return `${hkParts.join('')}${streetLine}`;
  }

  const eastAsianParts = uniqueParts([
    address.country,
    address.state,
    address.city,
    address.district,
    streetLine,
  ]);
  const internationalParts = uniqueParts([
    streetLine,
    address.district,
    address.city,
    address.state,
    address.country,
  ]);

  return (
    EAST_ASIAN_COUNTRIES.has(countryCode) ? eastAsianParts : internationalParts
  ).join(EAST_ASIAN_COUNTRIES.has(countryCode) ? ' · ' : ', ');
}

export function getAddressMetaItems(address: Address): AddressMetaItem[] {
  const config = pickAddressMetaConfig(address.country_code);
  const entries: AddressMetaItem[] = [];
  const usedValues = new Set<string>();

  const candidates: AddressMetaItem[] = [
    {
      key: 'state',
      label: config.stateLabel,
      value: normalizeLocalizedAddressValue(
        address.state?.trim(),
        address.country_code
      ),
    },
    {
      key: 'city',
      label: config.cityLabel,
      value: normalizeLocalizedAddressValue(
        address.city?.trim(),
        address.country_code
      ),
    },
    {
      key: 'district',
      label: config.districtLabel,
      value: normalizeLocalizedAddressValue(
        address.district?.trim(),
        address.country_code
      ),
    },
    {
      key: 'zipcode',
      label: config.zipcodeLabel,
      value: address.zipcode?.trim() ?? '',
    },
  ];

  for (const candidate of candidates) {
    if (!candidate.value || usedValues.has(candidate.value)) {
      continue;
    }

    usedValues.add(candidate.value);
    entries.push(candidate);
  }

  return entries;
}

export function normalizeReverseGeocodeAddress(
  osmAddress: ReverseAddress,
  fallbackAddress: Address
) {
  const countryCode = normalizeCountryCode(
    osmAddress.country_code ?? fallbackAddress.country_code
  );
  const locality = pickFirst(
    osmAddress.suburb,
    osmAddress.borough,
    osmAddress.neighbourhood,
    osmAddress.quarter,
    osmAddress.hamlet
  );
  const districtAdmin = pickFirst(
    osmAddress.city_district,
    osmAddress.county,
    osmAddress.state_district
  );

  let state = pickFirst(osmAddress.state, fallbackAddress.state);
  let city = pickFirst(
    osmAddress.city,
    osmAddress.town,
    osmAddress.village,
    osmAddress.municipality,
    fallbackAddress.city
  );
  let district = pickFirst(districtAdmin, locality, fallbackAddress.district);

  if (countryCode === 'CN') {
    const municipality = pickFirst(osmAddress.municipality, osmAddress.state);
    const districtLike = pickFirst(
      osmAddress.city_district,
      osmAddress.county,
      osmAddress.state_district,
      osmAddress.city,
      osmAddress.town,
      osmAddress.village
    );

    if (municipality) {
      city = municipality;
      district = pickFirst(districtLike, locality, fallbackAddress.district);

      if (state === city) {
        state = '';
      }
    } else {
      city = pickFirst(
        osmAddress.city,
        osmAddress.town,
        osmAddress.village,
        fallbackAddress.city
      );
      district = pickFirst(districtAdmin, locality, fallbackAddress.district);
    }
  }

  if (countryCode === 'HK' || countryCode === 'SG') {
    state = '';
    city = pickFirst(
      osmAddress.city,
      osmAddress.state,
      osmAddress.municipality,
      fallbackAddress.city
    );
    district = pickFirst(districtAdmin, locality, fallbackAddress.district);
  }

  if (city && district && city === district) {
    district = pickFirst(locality, fallbackAddress.district);
  }

  const streetName = pickFirst(
    osmAddress.road,
    fallbackAddress.streetName,
    fallbackAddress.street
  );
  const buildingNumber = pickFirst(
    osmAddress.house_number,
    fallbackAddress.buildingNumber
  );

  state = normalizeLocalizedAddressValue(state, countryCode);
  city = normalizeLocalizedAddressValue(city, countryCode);
  district = normalizeLocalizedAddressValue(district, countryCode);
  const normalizedStreetName = normalizeLocalizedAddressValue(
    streetName,
    countryCode
  );
  const normalizedCountry =
    countryCode === 'HK'
      ? '香港'
      : normalizeLocalizedAddressValue(
          pickFirst(osmAddress.country, fallbackAddress.country),
          countryCode
        );

  return {
    street: normalizedStreetName,
    streetName: normalizedStreetName,
    buildingNumber,
    city,
    district,
    state,
    zipcode: pickFirst(osmAddress.postcode, fallbackAddress.zipcode),
    country: normalizedCountry,
    country_code: countryCode || fallbackAddress.country_code,
  };
}

export function getBirthdayDisplay(value?: string) {
  if (!value) {
    return {
      date: '',
      age: '',
    };
  }

  const date = parseISO(value);

  if (!isValid(date)) {
    return {
      date: value,
      age: '',
    };
  }

  return {
    date: format(date, 'yyyy-MM-dd'),
    age: String(differenceInYears(new Date(), date)),
  };
}

export function getGenderDisplay(value?: string) {
  const normalized = value?.trim().toLowerCase() ?? '';

  if (
    normalized === 'male' ||
    normalized === 'man' ||
    normalized === 'm' ||
    normalized === '男'
  ) {
    return {
      label: '男',
      kind: 'male' as const,
    };
  }

  if (
    normalized === 'female' ||
    normalized === 'woman' ||
    normalized === 'f' ||
    normalized === '女'
  ) {
    return {
      label: '女',
      kind: 'female' as const,
    };
  }

  if (!normalized || normalized === 'unknown') {
    return {
      label: '其他',
      kind: 'unknown' as const,
    };
  }

  return {
    label: '其他',
    kind: 'other' as const,
  };
}

export function getAvatarDownloadName(
  user: Pick<IUser.asObject, 'firstname' | 'lastname' | 'address'>
) {
  const formattedName = formatPersonName(user);
  const formattedSlug = sanitizeEmailLocalPart(
    formattedName.replace(/\s+/g, '_')
  );
  const fallbackSlug = sanitizeEmailLocalPart(
    `${user.firstname}_${user.lastname}`
  );

  return formattedSlug || fallbackSlug || 'profile';
}
