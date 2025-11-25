export interface Recommendation {
  placeId: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  price?: string;
  address: string;
}
export interface RecommendationItemProps {
  item: {
    placeId: string;
    icon: string;
    title: string;
    desc: string;
    time: string;
    price?: string;
    address: string;
  };
  color: string;
  onClick: () => void;
}

export interface RecommendationListProps {
  recommendations: Recommendation[];
  loading: boolean;
  selectedGuId: string;
  selectedGuColor: string;
  guName: string;
  onItemClick: (item: Recommendation) => void;
}
