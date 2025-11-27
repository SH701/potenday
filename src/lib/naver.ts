import { title } from "process";

export async function searchNaverPlaces(keyword: string) {
  const res = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      keyword
    )}&display=15&sort=random`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Naver API error");
  }
  const data = await res.json();
  return data.items.map((item: any) => ({
    title: item.title.replace(/<[^>]*>/g, ""),
    link: item.link,
    address: item.address,
    category: item.category,
    telephone: item.telephone,
    google: `https://www.google.com/maps/search/${encodeURIComponent(
      item.title.replace(/<[^>]*>/g, "")
    )}`,
  }));
}
