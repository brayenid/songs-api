import fs from 'fs'

class StorageService {
  constructor(folder) {
    this._folder = folder
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true
      })
    }
  }

  writeFile(file, meta) {
    const now = Date.now()
    const fileName = `${now}-${meta.filename}`
    const path = `${this._folder}/${fileName}`
    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (err) => reject(err))
      file.pipe(fileStream)
      file.on('end', () => resolve(fileName))
    })
  }
}

export default StorageService
