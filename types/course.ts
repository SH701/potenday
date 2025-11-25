export interface Spot {
  name: string;
  desc: string;
  address?: string;
  arriveTime?: string;
  stayTime?: string;
  category?: string;
  nextMove?: string;
}
export interface Props {
  title: string;
  vibe: string | null | undefined;
  route?: string | null | undefined;
  spots: Spot[];
}
export interface CourseModalProps {
  course: Props | null;
  onClose: () => void;
  isOpen: boolean;
}
