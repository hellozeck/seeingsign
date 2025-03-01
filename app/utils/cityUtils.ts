import { Country, City } from 'country-state-city';

export function getCityInfo(countryCode: string, cityName: string) {
  console.log(`Looking up city: ${cityName} in country: ${countryCode}`);
  
  // 获取所有城市
  const cities = City.getCitiesOfCountry(countryCode) || [];
  
  // 查找特定城市
  const city = cities.find(c => c.name === cityName);
  
  if (city) {
    console.log('Found city:', {
      name: city.name,
      stateCode: city.stateCode,
      latitude: city.latitude,
      longitude: city.longitude,
      countryCode: city.countryCode
    });
    return city;
  } else {
    console.log('City not found');
    return null;
  }
}

// 测试中国的一些城市
export function testChineseCities() {
  const countryCode = 'CN';
  const cities = City.getCitiesOfCountry(countryCode) || [];
  console.log(`Total cities in China: ${cities.length}`);
  
  // 打印前10个城市的信息
  cities.slice(0, 10).forEach(city => {
    console.log({
      name: city.name,
      stateCode: city.stateCode,
      latitude: city.latitude,
      longitude: city.longitude
    });
  });
} 