export const galleryImages = Array.from(
  { length: 19 },
  (_, i) => `/images/${String(i + 1).padStart(2, "0")}.jpg`
);
