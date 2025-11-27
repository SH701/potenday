// app/api/place-detail/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam, 10) : 1;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const naverResponse = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        query
      )}&display=1`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!naverResponse.ok) {
      console.error("❌ Naver API error:", naverResponse.status);
      return NextResponse.json(
        { error: "Failed to fetch place details" },
        { status: naverResponse.status }
      );
    }

    const naverData = await naverResponse.json();
    if (!naverData.items || naverData.items.length === 0) {
      return NextResponse.json({ detail: null });
    }

    const naverItem = naverData.items[0];

    let photos: string[] = [];
    let rating: number | undefined;
    let reviewCount: number | undefined;

    if (process.env.GOOGLE_PLACES_API_KEY) {
      try {
        const googleSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query + " 서울"
        )}&key=${process.env.GOOGLE_PLACES_API_KEY}&language=ko`;

        const googleSearchResponse = await fetch(googleSearchUrl, {
          next: { revalidate: 3600 },
        });

        if (googleSearchResponse.ok) {
          const googleSearchData = await googleSearchResponse.json();

          if (googleSearchData.results?.length > 0) {
            const place = googleSearchData.results[0];
            rating = place.rating;
            reviewCount = place.user_ratings_total;

            if (place.place_id) {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos,rating,user_ratings_total&key=${process.env.GOOGLE_PLACES_API_KEY}`;

              const detailsResponse = await fetch(detailsUrl, {
                next: { revalidate: 3600 },
              });

              if (detailsResponse.ok) {
                const detailsData = await detailsResponse.json();
                if (detailsData.result?.photos) {
                  photos = detailsData.result.photos
                    .slice(0, 5)
                    .map(
                      (photo: any) =>
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
                    );
                }

                rating = detailsData.result?.rating;
                reviewCount = detailsData.result?.user_ratings_total;
              } else {
                console.error(
                  "❌ Google Details API Response Error:",
                  detailsResponse.status
                );
              }
            }
          } else {
            console.warn("⚠️ Google TextSearch 결과 없음:", query);
          }
        } else {
          console.error(
            "❌ Google TextSearch 실패:",
            googleSearchResponse.status
          );
        }
      } catch (googleError) {
        console.error("🔥 Google Places API Error:", googleError);
      }
    }

    const detail = {
      title: naverItem.title.replace(/<[^>]*>/g, ""),
      address: naverItem.address,
      roadAddress: naverItem.roadAddress,
      telephone: naverItem.telephone,
      category: naverItem.category,
      link: naverItem.link,
      photos: photos.slice(0, count),
      photo: photos?.[0] ?? null,
      rating,
      reviewCount,
    };

    return NextResponse.json({ detail });
  } catch (error) {
    console.error("💥 Error fetching place details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
