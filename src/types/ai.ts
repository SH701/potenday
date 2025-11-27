export interface NaverPlace {
  title: string;
  address: string;
  category: string;
}

export interface PlaceInfo {
  name: string;
  address: string;
  category: string;
}

export interface Recommendation {
  icon: string;
  title: string;
  desc: string;
  time: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}
