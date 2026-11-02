import type { ImgHTMLAttributes } from "react";
const widths: Record<string, number> = {
  "vmc-equipements": 1440,
  "vmc-reseaux": 1440,
  "vmc-cheminements": 1440,
  "vmc-video-poster": 720,
  "hotte-video-poster": 720,
  "annecy-panorama": 1800,
  "annecy-cta": 1200,
  "legumerie-ventilation": 1200,
  "lidl-extraction": 922,
  "forum-grenoble-projet": 1200,
  "htc-la-boisse-projet": 1550,
  "htc-la-boisse-reseaux": 1152,
  "htc-la-boisse-descentes": 1152,
  "htc-la-boisse-derivations": 1152,
  "htc-la-boisse-raccordements": 1152,
  "mont-blanc-presentation": 1461,
  "forum-grenoble-chantier": 1280,
  "yottacity-soufflage": 800,
  "grenoble-toiture": 800,
  "grenoble-gaines-circulaires": 800,
  "grenoble-raccordement": 800,
  "grenoble-gaines-rectangulaires": 800,
};
export function Photo({
  src,
  alt,
  sizes = "(max-width: 600px) calc(100vw - 44px), (max-width: 1392px) 45vw, 600px",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const name = src.split("/").pop()?.replace(".webp", "") || "";
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      decoding="async"
      sizes={sizes}
      srcSet={
        widths[name]
          ? [
              ...[480, 800]
                .filter((width) => width < widths[name])
                .map(
                  (width) =>
                    `${src.replace(".webp", `-${width}.webp`)} ${width}w`,
                ),
              `${src} ${widths[name]}w`,
            ].join(", ")
          : undefined
      }
    />
  );
}
