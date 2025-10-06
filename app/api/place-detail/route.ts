// app/api/place-detail/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    // 1단계: 네이버 지역 검색으로 기본 정보 가져오기
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
      console.error("Naver API error:", naverResponse.status);
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

    // 2단계: Google Places API로 사진과 평점 가져오기
    let photos: string[] = [];
    let rating: number | undefined;
    let reviewCount: number | undefined;

    if (process.env.GOOGLE_PLACES_API_KEY) {
      try {
        // Google Places Text Search
        const googleSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&key=${process.env.GOOGLE_PLACES_API_KEY}&language=ko`;

        const googleSearchResponse = await fetch(googleSearchUrl, {
          next: { revalidate: 3600 },
        });

        if (googleSearchResponse.ok) {
          const googleSearchData = await googleSearchResponse.json();

          if (googleSearchData.results && googleSearchData.results.length > 0) {
            const place = googleSearchData.results[0];
            rating = place.rating;
            reviewCount = place.user_ratings_total;

            // Place Details로 더 많은 사진 가져오기
            if (place.place_id) {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${process.env.GOOGLE_PLACES_API_KEY}`;

              const detailsResponse = await fetch(detailsUrl, {
                next: { revalidate: 3600 },
              });

              if (detailsResponse.ok) {
                const detailsData = await detailsResponse.json();

                if (detailsData.result?.photos) {
                  // 최대 5장의 사진
                  photos = detailsData.result.photos
                    .slice(0, 5)
                    .map(
                      (photo: any) =>
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
                    );
                }
              }
            }
          }
        }
      } catch (googleError) {
        console.error("Google Places API error:", googleError);
        // Google API 실패해도 네이버 데이터는 반환
      }
    }

    const detail = {
      title: naverItem.title.replace(/<[^>]*>/g, ""),
      address: naverItem.address,
      roadAddress: naverItem.roadAddress,
      telephone: naverItem.telephone,
      category: naverItem.category,
      link: naverItem.link,
      photos,
      rating,
      reviewCount,
    };

    return NextResponse.json({ detail });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
