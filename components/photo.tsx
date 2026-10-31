import type { ImgHTMLAttributes } from "react";
const widths: Record<string, number> = {
  "annecy-panorama": 1800,
  "annecy-cta": 1200,
  "legumerie-ventilation": 1200,
  "lidl-extraction": 922,
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
          ? `${src.replace(".webp", "-480.webp")} 480w, ${src.replace(".webp", "-800.webp")} 800w, ${src} ${widths[name]}w`
          : undefined
      }
    />
  );
}
