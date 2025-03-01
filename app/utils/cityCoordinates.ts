interface CityCoordinate {
  lat: number;
  lng: number;
  name: {
    en: string;
    zh: string;
  };
  state: string;
}

export const chineseCities: Record<string, CityCoordinate> = {
  'Cangzhou': {
    lat: 38.3037,
    lng: 116.8388,
    name: {
      en: 'Cangzhou',
      zh: '沧州'
    },
    state: 'Hebei'
  },
  'Beijing': {
    lat: 39.9042,
    lng: 116.4074,
    name: {
      en: 'Beijing',
      zh: '北京'
    },
    state: 'Beijing'
  },
  // 可以添加更多城市
};

export function findCity(cityName: string) {
  // 尝试直接匹配
  if (chineseCities[cityName]) {
    return chineseCities[cityName];
  }

  // 尝试不区分大小写匹配
  const lowerCityName = cityName.toLowerCase();
  const city = Object.entries(chineseCities).find(([key]) => 
    key.toLowerCase() === lowerCityName
  );

  return city ? city[1] : null;
} 