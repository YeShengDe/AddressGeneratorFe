interface PopulationCenter {
  origin: [number, number]; // [纬度, 经度]
  radius: number; // 半径，单位为公里
  locale: string; // Faker本地化代码
  country: string; // 国家名称
  countryCode: string; // 国家代码
  region: string; // 地区标识
  cityName: string; // 城市名称
}

export const populationCenters: PopulationCenter[] = [
  // 中国 - 扩展更多城市，缩小范围
  {
    origin: [39.904202, 116.407394],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'beijing',
    cityName: 'Beijing',
  },
  {
    origin: [31.230416, 121.473701],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'shanghai',
    cityName: 'Shanghai',
  },
  {
    origin: [23.129112, 113.264385],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'guangzhou',
    cityName: 'Guangzhou',
  },
  {
    origin: [22.543097, 114.057868],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'shenzhen',
    cityName: 'Shenzhen',
  },
  {
    origin: [30.572269, 104.066541],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'chengdu',
    cityName: 'Chengdu',
  },
  {
    origin: [29.563009, 106.551557],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'chongqing',
    cityName: 'Chongqing',
  },
  {
    origin: [30.294218, 120.161823],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'hangzhou',
    cityName: 'Hangzhou',
  },
  {
    origin: [32.059344, 118.796877],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'nanjing',
    cityName: 'Nanjing',
  },
  {
    origin: [38.047474, 114.514793],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'shijiazhuang',
    cityName: 'Shijiazhuang',
  },
  {
    origin: [36.651216, 117.120008],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'jinan',
    cityName: 'Jinan',
  },
  {
    origin: [34.267225, 108.954347],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'xian',
    cityName: "Xi'an",
  },
  {
    origin: [22.396428, 114.109497],
    radius: 10,
    locale: 'zh_CN',
    country: 'China',
    countryCode: 'CN',
    region: 'hong_kong_area',
    cityName: 'Hong Kong Area',
  },

  // 香港
  {
    origin: [22.3193, 114.1694],
    radius: 10,
    locale: 'en_HK',
    country: 'Hong Kong',
    countryCode: 'HK',
    region: 'hong_kong',
    cityName: 'Hong Kong',
  },
  {
    origin: [22.2794, 114.1617],
    radius: 10,
    locale: 'en_HK',
    country: 'Hong Kong',
    countryCode: 'HK',
    region: 'kowloon',
    cityName: 'Kowloon',
  },

  // 台湾
  {
    origin: [25.033964, 121.564468],
    radius: 10,
    locale: 'zh_TW',
    country: 'Taiwan',
    countryCode: 'TW',
    region: 'taipei',
    cityName: 'Taipei',
  },
  {
    origin: [24.147735, 120.673648],
    radius: 10,
    locale: 'zh_TW',
    country: 'Taiwan',
    countryCode: 'TW',
    region: 'taichung',
    cityName: 'Taichung',
  },
  {
    origin: [22.627278, 120.301435],
    radius: 10,
    locale: 'zh_TW',
    country: 'Taiwan',
    countryCode: 'TW',
    region: 'kaohsiung',
    cityName: 'Kaohsiung',
  },
  {
    origin: [24.806738, 120.97157],
    radius: 10,
    locale: 'zh_TW',
    country: 'Taiwan',
    countryCode: 'TW',
    region: 'hsinchu',
    cityName: 'Hsinchu',
  },

  // 日本 - 扩展更多城市
  {
    origin: [35.689487, 139.691711],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'tokyo',
    cityName: 'Tokyo',
  },
  {
    origin: [34.693725, 135.502254],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'osaka',
    cityName: 'Osaka',
  },
  {
    origin: [35.011636, 135.768029],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'kyoto',
    cityName: 'Kyoto',
  },
  {
    origin: [43.066742, 141.350755],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'sapporo',
    cityName: 'Sapporo',
  },
  {
    origin: [33.590353, 130.401715],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'fukuoka',
    cityName: 'Fukuoka',
  },
  {
    origin: [35.443707, 139.638031],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'yokohama',
    cityName: 'Yokohama',
  },
  {
    origin: [35.181446, 136.906398],
    radius: 10,
    locale: 'ja',
    country: 'Japan',
    countryCode: 'JP',
    region: 'nagoya',
    cityName: 'Nagoya',
  },

  // 韩国
  {
    origin: [37.566535, 126.977969],
    radius: 10,
    locale: 'ko',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'seoul',
    cityName: 'Seoul',
  },
  {
    origin: [35.179554, 129.075641],
    radius: 10,
    locale: 'ko',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'busan',
    cityName: 'Busan',
  },
  {
    origin: [37.4563, 126.7052],
    radius: 10,
    locale: 'ko',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'incheon',
    cityName: 'Incheon',
  },
  {
    origin: [35.8714, 128.6014],
    radius: 10,
    locale: 'ko',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'daegu',
    cityName: 'Daegu',
  },

  // 美国 - 保持现有，缩小范围
  {
    origin: [40.712776, -74.005974],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'new_york',
    cityName: 'New York',
  },
  {
    origin: [34.052235, -118.243683],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'los_angeles',
    cityName: 'Los Angeles',
  },
  {
    origin: [41.878113, -87.629799],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'chicago',
    cityName: 'Chicago',
  },
  {
    origin: [29.760427, -95.369804],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'houston',
    cityName: 'Houston',
  },
  {
    origin: [37.774929, -122.419418],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'san_francisco',
    cityName: 'San Francisco',
  },
  {
    origin: [47.606209, -122.332069],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'seattle',
    cityName: 'Seattle',
  },
  {
    origin: [33.448376, -112.074036],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'phoenix',
    cityName: 'Phoenix',
  },
  {
    origin: [32.715738, -117.161084],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'san_diego',
    cityName: 'San Diego',
  },
  {
    origin: [42.360082, -71.05888],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'boston',
    cityName: 'Boston',
  },
  {
    origin: [25.761681, -80.191788],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'miami',
    cityName: 'Miami',
  },
  {
    origin: [36.169941, -115.13983],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'las_vegas',
    cityName: 'Las Vegas',
  },
  {
    origin: [45.51223, -122.658722],
    radius: 10,
    locale: 'en_US',
    country: 'United States',
    countryCode: 'US',
    region: 'portland',
    cityName: 'Portland',
  },

  // 加拿大 - 缩小范围
  {
    origin: [43.65107, -79.347015],
    radius: 10,
    locale: 'en_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'toronto',
    cityName: 'Toronto',
  },
  {
    origin: [45.501689, -73.567256],
    radius: 10,
    locale: 'fr_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'montreal',
    cityName: 'Montreal',
  },
  {
    origin: [49.282729, -123.120738],
    radius: 10,
    locale: 'en_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'vancouver',
    cityName: 'Vancouver',
  },
  {
    origin: [51.044734, -114.071883],
    radius: 10,
    locale: 'en_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'calgary',
    cityName: 'Calgary',
  },
  {
    origin: [46.813878, -71.207981],
    radius: 10,
    locale: 'fr_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'quebec',
    cityName: 'Quebec City',
  },
  {
    origin: [45.42153, -75.697193],
    radius: 10,
    locale: 'en_CA',
    country: 'Canada',
    countryCode: 'CA',
    region: 'ottawa',
    cityName: 'Ottawa',
  },

  // 澳大利亚 - 缩小范围
  {
    origin: [-33.86882, 151.209296],
    radius: 10,
    locale: 'en_AU',
    country: 'Australia',
    countryCode: 'AU',
    region: 'sydney',
    cityName: 'Sydney',
  },
  {
    origin: [-37.813629, 144.963058],
    radius: 10,
    locale: 'en_AU',
    country: 'Australia',
    countryCode: 'AU',
    region: 'melbourne',
    cityName: 'Melbourne',
  },
  {
    origin: [-27.46977, 153.025131],
    radius: 10,
    locale: 'en_AU',
    country: 'Australia',
    countryCode: 'AU',
    region: 'brisbane',
    cityName: 'Brisbane',
  },
  {
    origin: [-31.950527, 115.860457],
    radius: 10,
    locale: 'en_AU',
    country: 'Australia',
    countryCode: 'AU',
    region: 'perth',
    cityName: 'Perth',
  },
  {
    origin: [-34.928497, 138.600739],
    radius: 10,
    locale: 'en_AU',
    country: 'Australia',
    countryCode: 'AU',
    region: 'adelaide',
    cityName: 'Adelaide',
  },

  // 新加坡
  {
    origin: [1.352083, 103.819836],
    radius: 10,
    locale: 'en_US',
    country: 'Singapore',
    countryCode: 'SG',
    region: 'singapore',
    cityName: 'Singapore',
  },

  // 英国 - 缩小范围，增加城市
  {
    origin: [51.507351, -0.127758],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'london',
    cityName: 'London',
  },
  {
    origin: [53.480759, -2.242631],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'manchester',
    cityName: 'Manchester',
  },
  {
    origin: [52.486244, -1.890401],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'birmingham',
    cityName: 'Birmingham',
  },
  {
    origin: [55.953252, -3.188267],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'edinburgh',
    cityName: 'Edinburgh',
  },
  {
    origin: [51.454514, -2.58791],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'bristol',
    cityName: 'Bristol',
  },
  {
    origin: [53.40454, -2.16162],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'liverpool',
    cityName: 'Liverpool',
  },
  {
    origin: [55.864237, -4.251806],
    radius: 10,
    locale: 'en_GB',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'glasgow',
    cityName: 'Glasgow',
  },

  // 爱尔兰
  {
    origin: [53.349805, -6.26031],
    radius: 10,
    locale: 'en_IE',
    country: 'Ireland',
    countryCode: 'IE',
    region: 'dublin',
    cityName: 'Dublin',
  },
  {
    origin: [51.896893, -8.486316],
    radius: 10,
    locale: 'en_IE',
    country: 'Ireland',
    countryCode: 'IE',
    region: 'cork',
    cityName: 'Cork',
  },

  // 法国 - 缩小范围，增加城市
  {
    origin: [48.856613, 2.352222],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'paris',
    cityName: 'Paris',
  },
  {
    origin: [45.764043, 4.835659],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'lyon',
    cityName: 'Lyon',
  },
  {
    origin: [43.296482, 5.36978],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'marseille',
    cityName: 'Marseille',
  },
  {
    origin: [47.218371, -1.553621],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'nantes',
    cityName: 'Nantes',
  },
  {
    origin: [43.604652, 1.444209],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'toulouse',
    cityName: 'Toulouse',
  },
  {
    origin: [43.710173, 7.261953],
    radius: 10,
    locale: 'fr',
    country: 'France',
    countryCode: 'FR',
    region: 'nice',
    cityName: 'Nice',
  },

  // 比利时
  {
    origin: [50.8503, 4.3517],
    radius: 10,
    locale: 'fr_BE',
    country: 'Belgium',
    countryCode: 'BE',
    region: 'brussels',
    cityName: 'Brussels',
  },
  {
    origin: [51.2194, 4.4025],
    radius: 10,
    locale: 'nl_BE',
    country: 'Belgium',
    countryCode: 'BE',
    region: 'antwerp',
    cityName: 'Antwerp',
  },

  // 瑞士
  {
    origin: [46.947974, 7.447447],
    radius: 10,
    locale: 'de_CH',
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'bern',
    cityName: 'Bern',
  },
  {
    origin: [47.376887, 8.541694],
    radius: 10,
    locale: 'de_CH',
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'zurich',
    cityName: 'Zurich',
  },
  {
    origin: [46.204391, 6.143158],
    radius: 10,
    locale: 'fr_CH',
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'geneva',
    cityName: 'Geneva',
  },

  // 德国 - 缩小范围，增加城市
  {
    origin: [52.520008, 13.404954],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'berlin',
    cityName: 'Berlin',
  },
  {
    origin: [48.135125, 11.581981],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'munich',
    cityName: 'Munich',
  },
  {
    origin: [50.110924, 8.682127],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'frankfurt',
    cityName: 'Frankfurt',
  },
  {
    origin: [53.551086, 9.993682],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'hamburg',
    cityName: 'Hamburg',
  },
  {
    origin: [51.227741, 6.773456],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'dusseldorf',
    cityName: 'Düsseldorf',
  },
  {
    origin: [50.937531, 6.960279],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'cologne',
    cityName: 'Cologne',
  },
  {
    origin: [48.783195, 9.180769],
    radius: 10,
    locale: 'de',
    country: 'Germany',
    countryCode: 'DE',
    region: 'stuttgart',
    cityName: 'Stuttgart',
  },

  // 奥地利
  {
    origin: [48.208176, 16.373819],
    radius: 10,
    locale: 'de_AT',
    country: 'Austria',
    countryCode: 'AT',
    region: 'vienna',
    cityName: 'Vienna',
  },
  {
    origin: [47.269212, 11.404102],
    radius: 10,
    locale: 'de_AT',
    country: 'Austria',
    countryCode: 'AT',
    region: 'innsbruck',
    cityName: 'Innsbruck',
  },

  // 荷兰
  {
    origin: [52.370216, 4.895168],
    radius: 10,
    locale: 'nl',
    country: 'Netherlands',
    countryCode: 'NL',
    region: 'amsterdam',
    cityName: 'Amsterdam',
  },
  {
    origin: [52.092876, 5.10448],
    radius: 10,
    locale: 'nl',
    country: 'Netherlands',
    countryCode: 'NL',
    region: 'utrecht',
    cityName: 'Utrecht',
  },
  {
    origin: [51.441642, 5.469722],
    radius: 10,
    locale: 'nl',
    country: 'Netherlands',
    countryCode: 'NL',
    region: 'eindhoven',
    cityName: 'Eindhoven',
  },

  // 意大利
  {
    origin: [41.902783, 12.496366],
    radius: 10,
    locale: 'it',
    country: 'Italy',
    countryCode: 'IT',
    region: 'rome',
    cityName: 'Rome',
  },
  {
    origin: [45.464204, 9.189982],
    radius: 10,
    locale: 'it',
    country: 'Italy',
    countryCode: 'IT',
    region: 'milan',
    cityName: 'Milan',
  },
  {
    origin: [40.851775, 14.268124],
    radius: 10,
    locale: 'it',
    country: 'Italy',
    countryCode: 'IT',
    region: 'naples',
    cityName: 'Naples',
  },
  {
    origin: [45.440847, 12.315515],
    radius: 10,
    locale: 'it',
    country: 'Italy',
    countryCode: 'IT',
    region: 'venice',
    cityName: 'Venice',
  },
  {
    origin: [43.76956, 11.255814],
    radius: 10,
    locale: 'it',
    country: 'Italy',
    countryCode: 'IT',
    region: 'florence',
    cityName: 'Florence',
  },

  // 西班牙
  {
    origin: [40.416775, -3.70379],
    radius: 10,
    locale: 'es',
    country: 'Spain',
    countryCode: 'ES',
    region: 'madrid',
    cityName: 'Madrid',
  },
  {
    origin: [41.385064, 2.173403],
    radius: 10,
    locale: 'es',
    country: 'Spain',
    countryCode: 'ES',
    region: 'barcelona',
    cityName: 'Barcelona',
  },
  {
    origin: [37.389092, -5.984459],
    radius: 10,
    locale: 'es',
    country: 'Spain',
    countryCode: 'ES',
    region: 'seville',
    cityName: 'Seville',
  },
  {
    origin: [39.469907, -0.376288],
    radius: 10,
    locale: 'es',
    country: 'Spain',
    countryCode: 'ES',
    region: 'valencia',
    cityName: 'Valencia',
  },

  // 葡萄牙
  {
    origin: [38.722252, -9.139337],
    radius: 10,
    locale: 'pt_PT',
    country: 'Portugal',
    countryCode: 'PT',
    region: 'lisbon',
    cityName: 'Lisbon',
  },
  {
    origin: [41.157944, -8.629105],
    radius: 10,
    locale: 'pt_PT',
    country: 'Portugal',
    countryCode: 'PT',
    region: 'porto',
    cityName: 'Porto',
  },

  // 墨西哥
  {
    origin: [19.432608, -99.133208],
    radius: 10,
    locale: 'es_MX',
    country: 'Mexico',
    countryCode: 'MX',
    region: 'mexico_city',
    cityName: 'Mexico City',
  },
  {
    origin: [20.659698, -103.349609],
    radius: 10,
    locale: 'es_MX',
    country: 'Mexico',
    countryCode: 'MX',
    region: 'guadalajara',
    cityName: 'Guadalajara',
  },
  {
    origin: [25.686614, -100.316113],
    radius: 10,
    locale: 'es_MX',
    country: 'Mexico',
    countryCode: 'MX',
    region: 'monterrey',
    cityName: 'Monterrey',
  },

  // 巴西
  {
    origin: [-23.55052, -46.633308],
    radius: 10,
    locale: 'pt_BR',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'sao_paulo',
    cityName: 'São Paulo',
  },
  {
    origin: [-22.906847, -43.172897],
    radius: 10,
    locale: 'pt_BR',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'rio_de_janeiro',
    cityName: 'Rio de Janeiro',
  },
  {
    origin: [-15.826691, -47.921822],
    radius: 10,
    locale: 'pt_BR',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'brasilia',
    cityName: 'Brasília',
  },
  {
    origin: [-12.971599, -38.501187],
    radius: 10,
    locale: 'pt_BR',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'salvador',
    cityName: 'Salvador',
  },

  // 阿根廷
  {
    origin: [-34.603684, -58.381559],
    radius: 10,
    locale: 'es',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'buenos_aires',
    cityName: 'Buenos Aires',
  },
  {
    origin: [-31.420083, -64.188776],
    radius: 10,
    locale: 'es',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'cordoba',
    cityName: 'Córdoba',
  },

  // 印度
  {
    origin: [28.613939, 77.209023],
    radius: 10,
    locale: 'en_IN',
    country: 'India',
    countryCode: 'IN',
    region: 'delhi',
    cityName: 'New Delhi',
  },
  {
    origin: [19.075983, 72.877655],
    radius: 10,
    locale: 'en_IN',
    country: 'India',
    countryCode: 'IN',
    region: 'mumbai',
    cityName: 'Mumbai',
  },
  {
    origin: [12.971599, 77.594563],
    radius: 10,
    locale: 'en_IN',
    country: 'India',
    countryCode: 'IN',
    region: 'bangalore',
    cityName: 'Bangalore',
  },
  {
    origin: [13.08268, 80.270718],
    radius: 10,
    locale: 'en_IN',
    country: 'India',
    countryCode: 'IN',
    region: 'chennai',
    cityName: 'Chennai',
  },
  {
    origin: [22.572646, 88.363895],
    radius: 10,
    locale: 'en_IN',
    country: 'India',
    countryCode: 'IN',
    region: 'kolkata',
    cityName: 'Kolkata',
  },

  // 南非
  {
    origin: [-33.924869, 18.424055],
    radius: 10,
    locale: 'en_ZA',
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'cape_town',
    cityName: 'Cape Town',
  },
  {
    origin: [-26.244156, 28.04223],
    radius: 10,
    locale: 'en_ZA',
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'johannesburg',
    cityName: 'Johannesburg',
  },
  {
    origin: [-29.859085, 31.021194],
    radius: 10,
    locale: 'en_ZA',
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'durban',
    cityName: 'Durban',
  },

  // 俄罗斯
  {
    origin: [55.755825, 37.617298],
    radius: 10,
    locale: 'ru',
    country: 'Russia',
    countryCode: 'RU',
    region: 'moscow',
    cityName: 'Moscow',
  },
  {
    origin: [59.931244, 30.335088],
    radius: 10,
    locale: 'ru',
    country: 'Russia',
    countryCode: 'RU',
    region: 'st_petersburg',
    cityName: 'St. Petersburg',
  },
  {
    origin: [56.326944, 44.006516],
    radius: 10,
    locale: 'ru',
    country: 'Russia',
    countryCode: 'RU',
    region: 'nizhny_novgorod',
    cityName: 'Nizhny Novgorod',
  },

  // 乌克兰
  {
    origin: [50.4501, 30.5234],
    radius: 10,
    locale: 'uk',
    country: 'Ukraine',
    countryCode: 'UA',
    region: 'kyiv',
    cityName: 'Kyiv',
  },
  {
    origin: [49.9935, 36.2304],
    radius: 10,
    locale: 'uk',
    country: 'Ukraine',
    countryCode: 'UA',
    region: 'kharkiv',
    cityName: 'Kharkiv',
  },

  // 波兰
  {
    origin: [52.229676, 21.012229],
    radius: 10,
    locale: 'pl',
    country: 'Poland',
    countryCode: 'PL',
    region: 'warsaw',
    cityName: 'Warsaw',
  },
  {
    origin: [50.064192, 19.944981],
    radius: 10,
    locale: 'pl',
    country: 'Poland',
    countryCode: 'PL',
    region: 'krakow',
    cityName: 'Kraków',
  },
  {
    origin: [54.372158, 18.638306],
    radius: 10,
    locale: 'pl',
    country: 'Poland',
    countryCode: 'PL',
    region: 'gdansk',
    cityName: 'Gdańsk',
  },

  // 捷克
  {
    origin: [50.075538, 14.4378],
    radius: 10,
    locale: 'cs_CZ',
    country: 'Czech Republic',
    countryCode: 'CZ',
    region: 'prague',
    cityName: 'Prague',
  },
  {
    origin: [49.195061, 16.606837],
    radius: 10,
    locale: 'cs_CZ',
    country: 'Czech Republic',
    countryCode: 'CZ',
    region: 'brno',
    cityName: 'Brno',
  },

  // 匈牙利
  {
    origin: [47.497912, 19.040235],
    radius: 10,
    locale: 'hu',
    country: 'Hungary',
    countryCode: 'HU',
    region: 'budapest',
    cityName: 'Budapest',
  },

  // 罗马尼亚
  {
    origin: [44.426767, 26.102538],
    radius: 10,
    locale: 'ro',
    country: 'Romania',
    countryCode: 'RO',
    region: 'bucharest',
    cityName: 'Bucharest',
  },
  {
    origin: [46.770439, 23.591423],
    radius: 10,
    locale: 'ro',
    country: 'Romania',
    countryCode: 'RO',
    region: 'cluj_napoca',
    cityName: 'Cluj-Napoca',
  },

  // 斯洛伐克
  {
    origin: [48.148596, 17.107748],
    radius: 10,
    locale: 'sk',
    country: 'Slovakia',
    countryCode: 'SK',
    region: 'bratislava',
    cityName: 'Bratislava',
  },

  // 克罗地亚
  {
    origin: [45.815011, 15.981919],
    radius: 10,
    locale: 'hr',
    country: 'Croatia',
    countryCode: 'HR',
    region: 'zagreb',
    cityName: 'Zagreb',
  },

  // 挪威
  {
    origin: [59.913869, 10.752245],
    radius: 10,
    locale: 'nb_NO',
    country: 'Norway',
    countryCode: 'NO',
    region: 'oslo',
    cityName: 'Oslo',
  },
  {
    origin: [60.391263, 5.322054],
    radius: 10,
    locale: 'nb_NO',
    country: 'Norway',
    countryCode: 'NO',
    region: 'bergen',
    cityName: 'Bergen',
  },

  // 瑞典
  {
    origin: [59.329323, 18.068581],
    radius: 10,
    locale: 'sv',
    country: 'Sweden',
    countryCode: 'SE',
    region: 'stockholm',
    cityName: 'Stockholm',
  },
  {
    origin: [57.70887, 11.97456],
    radius: 10,
    locale: 'sv',
    country: 'Sweden',
    countryCode: 'SE',
    region: 'gothenburg',
    cityName: 'Gothenburg',
  },

  // 丹麦
  {
    origin: [55.676097, 12.568337],
    radius: 10,
    locale: 'da',
    country: 'Denmark',
    countryCode: 'DK',
    region: 'copenhagen',
    cityName: 'Copenhagen',
  },
  {
    origin: [56.162939, 10.203921],
    radius: 10,
    locale: 'da',
    country: 'Denmark',
    countryCode: 'DK',
    region: 'aarhus',
    cityName: 'Aarhus',
  },

  // 芬兰
  {
    origin: [60.169856, 24.938379],
    radius: 10,
    locale: 'fi',
    country: 'Finland',
    countryCode: 'FI',
    region: 'helsinki',
    cityName: 'Helsinki',
  },
  {
    origin: [61.497752, 23.760954],
    radius: 10,
    locale: 'fi',
    country: 'Finland',
    countryCode: 'FI',
    region: 'tampere',
    cityName: 'Tampere',
  },

  // 希腊
  {
    origin: [37.975334, 23.734151],
    radius: 10,
    locale: 'el',
    country: 'Greece',
    countryCode: 'GR',
    region: 'athens',
    cityName: 'Athens',
  },
  {
    origin: [40.640063, 22.944419],
    radius: 10,
    locale: 'el',
    country: 'Greece',
    countryCode: 'GR',
    region: 'thessaloniki',
    cityName: 'Thessaloniki',
  },

  // 土耳其
  {
    origin: [41.008238, 28.978359],
    radius: 10,
    locale: 'tr',
    country: 'Turkey',
    countryCode: 'TR',
    region: 'istanbul',
    cityName: 'Istanbul',
  },
  {
    origin: [39.933364, 32.859742],
    radius: 10,
    locale: 'tr',
    country: 'Turkey',
    countryCode: 'TR',
    region: 'ankara',
    cityName: 'Ankara',
  },
  {
    origin: [38.423734, 27.142826],
    radius: 10,
    locale: 'tr',
    country: 'Turkey',
    countryCode: 'TR',
    region: 'izmir',
    cityName: 'Izmir',
  },

  // 以色列
  {
    origin: [31.771959, 35.217018],
    radius: 10,
    locale: 'he',
    country: 'Israel',
    countryCode: 'IL',
    region: 'jerusalem',
    cityName: 'Jerusalem',
  },
  {
    origin: [32.109333, 34.855499],
    radius: 10,
    locale: 'he',
    country: 'Israel',
    countryCode: 'IL',
    region: 'tel_aviv',
    cityName: 'Tel Aviv',
  },

  // 阿联酋
  {
    origin: [25.204849, 55.270783],
    radius: 10,
    locale: 'ar',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    region: 'dubai',
    cityName: 'Dubai',
  },
  {
    origin: [24.453884, 54.377344],
    radius: 10,
    locale: 'ar',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    region: 'abu_dhabi',
    cityName: 'Abu Dhabi',
  },

  // 沙特阿拉伯
  {
    origin: [24.774265, 46.738586],
    radius: 10,
    locale: 'ar',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    region: 'riyadh',
    cityName: 'Riyadh',
  },
  {
    origin: [21.485811, 39.192505],
    radius: 10,
    locale: 'ar',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    region: 'jeddah',
    cityName: 'Jeddah',
  },

  // 伊朗
  {
    origin: [35.689197, 51.388974],
    radius: 10,
    locale: 'fa',
    country: 'Iran',
    countryCode: 'IR',
    region: 'tehran',
    cityName: 'Tehran',
  },
  {
    origin: [29.630771, 52.516766],
    radius: 10,
    locale: 'fa',
    country: 'Iran',
    countryCode: 'IR',
    region: 'shiraz',
    cityName: 'Shiraz',
  },

  // 泰国
  {
    origin: [13.756331, 100.501765],
    radius: 10,
    locale: 'th',
    country: 'Thailand',
    countryCode: 'TH',
    region: 'bangkok',
    cityName: 'Bangkok',
  },
  {
    origin: [18.788132, 98.985107],
    radius: 10,
    locale: 'th',
    country: 'Thailand',
    countryCode: 'TH',
    region: 'chiang_mai',
    cityName: 'Chiang Mai',
  },

  // 越南
  {
    origin: [21.028511, 105.804817],
    radius: 10,
    locale: 'vi',
    country: 'Vietnam',
    countryCode: 'VN',
    region: 'hanoi',
    cityName: 'Hanoi',
  },
  {
    origin: [10.823099, 106.629664],
    radius: 10,
    locale: 'vi',
    country: 'Vietnam',
    countryCode: 'VN',
    region: 'ho_chi_minh',
    cityName: 'Ho Chi Minh City',
  },

  // 印度尼西亚
  {
    origin: [-6.208763, 106.845599],
    radius: 10,
    locale: 'id_ID',
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'jakarta',
    cityName: 'Jakarta',
  },
  {
    origin: [-7.797068, 110.370529],
    radius: 10,
    locale: 'id_ID',
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'yogyakarta',
    cityName: 'Yogyakarta',
  },

  // 马来西亚
  {
    origin: [3.139003, 101.686855],
    radius: 10,
    locale: 'en_US',
    country: 'Malaysia',
    countryCode: 'MY',
    region: 'kuala_lumpur',
    cityName: 'Kuala Lumpur',
  },
  {
    origin: [5.414184, 100.329114],
    radius: 10,
    locale: 'en_US',
    country: 'Malaysia',
    countryCode: 'MY',
    region: 'penang',
    cityName: 'Penang',
  },

  // 菲律宾
  {
    origin: [14.599512, 120.984219],
    radius: 10,
    locale: 'en_US',
    country: 'Philippines',
    countryCode: 'PH',
    region: 'manila',
    cityName: 'Manila',
  },
  {
    origin: [10.315699, 123.885437],
    radius: 10,
    locale: 'en_US',
    country: 'Philippines',
    countryCode: 'PH',
    region: 'cebu',
    cityName: 'Cebu',
  },

  // 新西兰
  {
    origin: [-36.848461, 174.762188],
    radius: 10,
    locale: 'en_AU',
    country: 'New Zealand',
    countryCode: 'NZ',
    region: 'auckland',
    cityName: 'Auckland',
  },
  {
    origin: [-41.288889, 174.777222],
    radius: 10,
    locale: 'en_AU',
    country: 'New Zealand',
    countryCode: 'NZ',
    region: 'wellington',
    cityName: 'Wellington',
  },

  // 阿塞拜疆
  {
    origin: [40.409264, 49.867092],
    radius: 10,
    locale: 'az',
    country: 'Azerbaijan',
    countryCode: 'AZ',
    region: 'baku',
    cityName: 'Baku',
  },

  // 加纳
  {
    origin: [5.603717, -0.186964],
    radius: 10,
    locale: 'en_GH',
    country: 'Ghana',
    countryCode: 'GH',
    region: 'accra',
    cityName: 'Accra',
  },
  {
    origin: [6.688437, -1.609286],
    radius: 10,
    locale: 'en_GH',
    country: 'Ghana',
    countryCode: 'GH',
    region: 'kumasi',
    cityName: 'Kumasi',
  },

  // 尼日利亚
  {
    origin: [9.072264, 7.491302],
    radius: 10,
    locale: 'en_NG',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'abuja',
    cityName: 'Abuja',
  },
  {
    origin: [6.524379, 3.379206],
    radius: 10,
    locale: 'en_NG',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'lagos',
    cityName: 'Lagos',
  },
];
