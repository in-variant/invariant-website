import coverVariants from './.generated-cover-srcsets.json'
import { formatCoverSrcSet } from './formatCoverSrcSet.mjs'

const covers: Partial<Record<string, { width: number; variants: { size: number; hash: string }[] }>> = coverVariants

export function coverSrcSet(image: string) {
  const cover = covers[image]
  return cover && formatCoverSrcSet(image, cover.width, cover.variants)
}
