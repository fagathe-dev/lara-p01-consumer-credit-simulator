export { Avatar, type AvatarProps, type AvatarSize } from './Avatar';
export {
  Image,
  type ImageProps,
  type ImageRadius,
  type ImageFit,
} from './Image';
export { Figure, type FigureProps } from './Figure';
// Note: `Icon` lives in Base (single source of truth) to avoid a duplicate
// barrel export; import it from `@/ui/components/Base/Icon`.
