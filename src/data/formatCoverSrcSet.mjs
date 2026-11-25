export function formatCoverSrcSet(image, width, variants) {
  const filename = image.split('?')[0].split('/').pop()
  const name = filename.replace(/\.webp$/, '')
  return [
    ...variants.map(({ size, hash }) => `/blog/industry-variants/${name}-${size}.${hash}.webp ${size}w`),
    `${image} ${width}w`,
  ].join(', ')
}
