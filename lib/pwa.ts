/** Écrans de démarrage iOS (application ajoutée à l’écran d’accueil). */
const devices: [w: number, h: number, dpr: number][] = [
  [440, 956, 3], // iPhone 16 Pro Max, 17 Pro Max
  [420, 912, 3], // iPhone Air
  [402, 874, 3], // iPhone 16 Pro, 17, 17 Pro
  [430, 932, 3], // iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  [393, 852, 3], // iPhone 14 Pro, 15, 15 Pro, 16
  [428, 926, 3], // iPhone 12/13 Pro Max, 14 Plus
  [390, 844, 3], // iPhone 12, 13, 14, 16e
  [375, 812, 3], // iPhone X, XS, 11 Pro, 12/13 mini
  [414, 896, 3], // iPhone XS Max, 11 Pro Max
  [414, 896, 2], // iPhone XR, 11
  [414, 736, 3], // iPhone 8 Plus
  [375, 667, 2], // iPhone SE, 8
];

export const splashSizes = devices.map(([w, h, dpr]) => ({
  width: w * dpr,
  height: h * dpr,
}));

export const startupImages = devices.map(([w, h, dpr]) => ({
  url: `/splash/splash-${w * dpr}x${h * dpr}.png`,
  media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`,
}));
