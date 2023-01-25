export const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="transparent" offset="0" />
      <stop stop-color="#ffffff14" offset="70%" />
      <stop stop-color="transparent" offset="1" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#ffffff21" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="${w}" to="-${w}" dur="1.6s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);