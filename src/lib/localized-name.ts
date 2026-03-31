import type { Faker } from '@faker-js/faker';

type SupportedLocalizedSurnameCountry = 'CN' | 'TW' | 'HK' | 'JP' | 'KR';

const CHINESE_SURNAMES = [
  '王',
  '李',
  '张',
  '刘',
  '陈',
  '杨',
  '赵',
  '黄',
  '周',
  '吴',
  '徐',
  '孙',
  '胡',
  '朱',
  '高',
  '林',
  '何',
  '郭',
  '马',
  '罗',
  '梁',
  '宋',
  '郑',
  '谢',
  '韩',
  '唐',
  '冯',
  '于',
  '董',
  '萧',
  '程',
  '曹',
  '袁',
  '邓',
  '许',
  '傅',
  '沈',
  '曾',
  '彭',
  '吕',
] as const;

const JAPANESE_SURNAMES = [
  '佐藤',
  '鈴木',
  '高橋',
  '田中',
  '伊藤',
  '渡辺',
  '山本',
  '中村',
  '小林',
  '加藤',
  '吉田',
  '山田',
  '佐々木',
  '山口',
  '松本',
  '井上',
  '木村',
  '林',
  '清水',
  '斎藤',
  '阿部',
  '森',
  '池田',
  '橋本',
] as const;

const KOREAN_SURNAMES = [
  '김',
  '이',
  '박',
  '최',
  '정',
  '강',
  '조',
  '윤',
  '장',
  '임',
  '한',
  '오',
  '서',
  '신',
  '권',
  '황',
  '안',
  '송',
  '전',
  '홍',
] as const;

function normalizeCountryCode(countryCode?: string) {
  return countryCode?.trim().toUpperCase() as SupportedLocalizedSurnameCountry;
}

export function generateLocalizedSurname(faker: Faker, countryCode?: string) {
  switch (normalizeCountryCode(countryCode)) {
    case 'CN':
    case 'TW':
    case 'HK':
      return faker.helpers.arrayElement(CHINESE_SURNAMES);
    case 'JP':
      return faker.helpers.arrayElement(JAPANESE_SURNAMES);
    case 'KR':
      return faker.helpers.arrayElement(KOREAN_SURNAMES);
    default:
      return null;
  }
}
