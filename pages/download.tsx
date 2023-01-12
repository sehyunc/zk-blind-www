import React, { useEffect } from 'react'
import localforage from 'localforage'
const tar = require('tar-stream')
const zlib = require('zlib')

type Props = {}

const zkeySuffix = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
const zkeyExtension = ''
const loadURL = 'https://zkjwt-zkey-chunks.s3.amazonaws.com/'

export async function downloadFromFilename(
  filename: string,
  compressed = false
) {
  const link = loadURL + filename
  const uncompressFilePromises = []
  try {
    const zkeyResp = await fetch(link, {
      method: 'GET'
    })
    const zkeyBuff = await zkeyResp.arrayBuffer()
    console.log('🚀 ~ zkeyBuff', zkeyBuff, filename)
    if (!compressed) {
      await localforage.setItem(filename, zkeyBuff)
    } else {
      await uncompressAndStore(zkeyBuff, filename)
    }
    console.log(`Storage of ${filename} successful!`)
  } catch (e) {
    console.log(
      `Storage of ${filename} unsuccessful, make sure IndexedDB is enabled in your browser.`
    )
  }
}

export const downloadProofFiles = async function (filename: string) {
  const filePromises = []
  for (const c of zkeySuffix) {
    const itemCompressed = await localforage.getItem(
      `${filename}.zkey${c}${zkeyExtension}`
    )
    const item = await localforage.getItem(`${filename}.zkey${c}`)
    console.log('🚀 ~ downloadProofFiles ~ item', item)
    if (item || itemCompressed) {
      console.log(
        `${filename}.zkey${c}${
          item ? '' : zkeyExtension
        } already found in localstorage!`
      )
      continue
    }
    filePromises.push(
      downloadFromFilename(`${filename}.zkey${c}${zkeyExtension}`)
    )
  }
  console.log(filePromises)
  await Promise.all(filePromises)
}

// Un-targz the arrayBuffer into the filename without the .tar.gz on the end
const uncompressAndStore = async function (
  arrayBuffer: ArrayBuffer,
  filename: string
) {
  console.log(`Started to uncompress ${filename}...!`)
  const extract = tar.extract() // create a tar extract stream
  const gunzip = zlib.createGunzip(arrayBuffer) // create a gunzip stream from the array buffer
  gunzip.pipe(extract) // pipe the gunzip stream into the tar extract stream

  // header is the tar header, stream is the content body (might be an empty stream), call next when you are done with this entry
  extract.on('entry', function (header: any, stream: any, next: Function) {
    // decompress the entry data
    const extractedData: any = []
    stream.on('data', function (chunk: any) {
      extractedData.push(chunk)
    })

    // make sure to call next when the entry is fully processed
    stream.on('end', function () {
      next()

      console.assert(
        filename.endsWith(zkeyExtension),
        `Filename doesn't end in ${zkeyExtension}`
      )
      const rawFilename = filename.replace(/.tar.gz$/, '')
      // save the extracted data to localForage
      localforage.setItem(rawFilename, extractedData, function (err: Error) {
        if (err) {
          console.error(`Couldn't extract data from ${filename}:` + err.message)
        } else {
          console.log('Saved extracted file to localForage')
        }
      })
    })
  })

  // all entries have been processed
  extract.on('finish', function () {
    console.log(`Finished extracting ${filename}`)
  })
}

const Download = (props: Props) => {
  useEffect(() => {
    const getFile = async () => {
      const file = await localforage.getItem('jwt.zkeyh')
      console.log(file)
    }
    getFile()
  }, [])
  return (
    <div>
      <button onClick={() => downloadProofFiles('jwt')}>Download</button>
    </div>
  )
}

export default Download
