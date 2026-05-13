import sharp from 'sharp'
import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'

const SPEAKERS_DIR = join(import.meta.dirname, '..', 'public', 'speakers')
const OUTPUT_FILE = join(import.meta.dirname, '..', 'src', 'data', 'speaker-blur-data.ts')

const files = (await readdir(SPEAKERS_DIR)).filter(f => f.endsWith('.jpg'))

const entries = []
for (const file of files) {
  const buf = await sharp(join(SPEAKERS_DIR, file))
    .resize(16, 18, { fit: 'cover' })
    .jpeg({ quality: 20 })
    .toBuffer()
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`
  entries.push(`  '/speakers/${file}': '${dataUrl}'`)
}

const ts = `export const SPEAKER_BLUR_DATA: Record<string, string> = {\n${entries.join(',\n')},\n}\n`
await writeFile(OUTPUT_FILE, ts)
console.log(`Generated blur data for ${entries.length} images → ${OUTPUT_FILE}`)
