import { ITransfer } from './ITransfer'
import { Auth } from 'googleapis'

const prompt = require('prompt');
const Photos = require('googlephotos')

type GooglePhotosSettings = {albumId:string, token:string, enabled:boolean}

export class GooglePhotos implements ITransfer {
  private client:any
  private settings:GooglePhotosSettings

  constructor(settings:GooglePhotosSettings) {
    this.settings = settings
    this.client = new Photos(this.settings.token)
  }

  public async transfer (file:string, dir:string) {
    if (!this.settings.enabled) return

    console.log('Uploading file to Google Photos', file)
    await this.client.mediaItems.upload(this.settings.albumId, file, `${dir}/${file}`)
    console.log('Upload complete to Google Photos', file)
  }
}

async function test() {
  
}

test()