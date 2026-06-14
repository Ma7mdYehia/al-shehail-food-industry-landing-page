import {
  FlatbreadIcon,
  LoafIcon,
  SamoonIcon,
  BunIcon,
  CroissantIcon,
  CroissantLargeIcon,
  PuffPastryIcon,
  MaamoulIcon,
  DateBallIcon,
} from "./Icons";

export type ProductIconType =
  | "flatbread"
  | "loaf"
  | "samoon"
  | "bun"
  | "croissant"
  | "croissantLarge"
  | "puff"
  | "maamoul"
  | "date";

const iconMap: Record<
  ProductIconType,
  (p: { width?: number; height?: number }) => JSX.Element
> = {
  flatbread: FlatbreadIcon,
  loaf: LoafIcon,
  samoon: SamoonIcon,
  bun: BunIcon,
  croissant: CroissantIcon,
  croissantLarge: CroissantLargeIcon,
  puff: PuffPastryIcon,
  maamoul: MaamoulIcon,
  date: DateBallIcon,
};

type Props = {
  type: ProductIconType;
  width?: number;
  height?: number;
};

export default function ProductIcon({ type, width = 22, height = 22 }: Props) {
  const Icon = iconMap[type];
  return <Icon width={width} height={height} />;
}
