import { guData } from "@/data/gudata";

interface WeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export async function Weather(guName: string): Promise<WeatherResponse> {
  const gu = guData.find((g) => g.name === guName);
  if (!gu) {
    throw new Error(`'${guName}' 구를 찾을 수 없습니다.`);
  }

  const apiKey = process.env.WEATHER_KEY;

  const { lat, lon } = gu;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API 에러 응답:", errorText);
    throw new Error(
      `날씨 데이터를 불러오지 못했습니다. (상태 코드: ${res.status})`
    );
  }

  const data: WeatherResponse = await res.json();

  return data;
}
