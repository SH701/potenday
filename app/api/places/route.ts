import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "query parameter required" },
      { status: 400 }
    );
  }

  const localRes = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      query
    )}&display=5&sort=random`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );

  if (!localRes.ok) {
    const err = await localRes.text();
    return NextResponse.json(
      { error: "Local API error", detail: err },
      { status: 502 }
    );
  }

  const localData = await localRes.json();

  const results = await Promise.all(
    localData.items.map(async (item: any) => {
      const geoRes = await fetch(
        `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
          item.address
        )}`,
        {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.NCP_CLIENT_ID!,
            "X-NCP-APIGW-API-KEY": process.env.NCP_CLIENT_SECRET!,
          },
        }
      );

      const geoData = await geoRes.json();

      let lat = null;
      let lng = null;
      if (geoData.addresses && geoData.addresses.length > 0) {
        lat = geoData.addresses[0].y;
        lng = geoData.addresses[0].x;
      }

      return {
        name: item.title.replace(/<[^>]*>?/g, ""),
        category: item.category,
        address: item.address,
        roadAddress: item.roadAddress,
        link: item.link,
        phone: item.telephone,
        lat,
        lng,
      };
    })
  );

  return NextResponse.json({ items: results });
}
