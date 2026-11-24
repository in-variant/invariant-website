import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const publicRoot = new URL('../public/', import.meta.url)
const outputPath = '/blog/industry-variants/'
const output = new URL(outputPath.slice(1), publicRoot)
const widths = [256, 480, 768, 1152]

export async function buildCoverVariants(images) {
  await mkdir(output, { recursive: true })
  const produced = new Set()
  const covers = new Map()

  // Limit simultaneous decodes to keep the build's memory use predictable.
  const batchSize = 6
  for (let index = 0; index < images.length; index += batchSize) {
    await Promise.all(images.slice(index, index + batchSize).map(async (image) => {
      const url = new URL(image.slice(1), publicRoot)
      const bytes = await readFile(url)
      const { width, height } = await sharp(bytes).metadata()
      const name = url.pathname.split('/').pop().replace(/\.webp$/, '')
      const candidates = []
      for (const size of widths.filter(size => size < width)) {
        const variant = await sharp(bytes).resize({ width: size, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
        if (variant.length >= bytes.length) continue
        const hash = createHash('sha256').update(variant).digest('hex').slice(0, 12)
        const file = `${name}-${size}.${hash}.webp`
        await writeFile(new URL(file, output), variant)
        produced.add(file)
        candidates.push(`${outputPath}${file} ${size}w`)
      }
      if (candidates.length) {
        candidates.push(`${image} ${width}w`)
        covers.set(image, { width, height, srcSet: candidates.join(', ') })
      }
    }))
  }

  for (const file of await readdir(output)) {
    if (/^[a-z0-9-]+-\d+\.[a-f0-9]{12}\.webp$/.test(file) && !produced.has(file)) {
      await unlink(new URL(file, output))
    }
  }
  console.log(`Built ${produced.size} responsive cover images for ${covers.size} originals`)
  return covers
}
