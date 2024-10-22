import Tesseract, { createWorker } from 'tesseract.js'

export const recognizeText = async (image: any) => {
  const worker = await createWorker(['rus', 'eng'], Tesseract.OEM.DEFAULT, { cacheMethod: 'none' })
  const ret = await worker.recognize(image)
  await worker.terminate()
  return ret.data.text
}