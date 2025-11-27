// schema.prisma 기반 수동 타입 정의

export type User = {
  clerkId: string;
  photo: string | null;
  username: string | null;
  nickname: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Post = {
  id: number;
  post: string;
  photo: string | null;
  created_at: Date;
  updated_at: Date;
  userId: string;
};

export type Comment = {
  id: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
  userId: string;
  postId: number;
};

export type Like = {
  id: number;
  userId: string;
  postId: number;
  created_at: Date;
};

export type Star = {
  id: number;
  userId: string;
  placeId: string;
  title: string;
  desc: string | null;
  icon: string | null;
  time: string | null;
  price: string | null;
  address: string | null;
  created_at: Date;
};

export type Course = {
  id: string;
  userId: string;
  personaId: string | null;
  title: string;
  vibe: string | null;
  route: string | null;
  totalDuration: string | null;
  spots: any; // Json
  created_at: Date;
};
