import { createWorker } from 'tesseract.js'


export const recognizeText = async (image: any) => {
  const worker = await createWorker('rus')
  const ret = await worker.recognize(image)
  await worker.terminate()
  return ret.data.text
}