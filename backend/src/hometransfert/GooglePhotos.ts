import { ITransfer } from './ITransfer'
import { Auth } from 'googleapis'
import { Settings } from '../Settings'

const prompt = require('prompt');
const Photos = require('googlephotos')

type GooglePhotosSettings = {albumId?:string, refreshToken:string, enabled:boolean, albumName?:string, clientId:string, clientSecret:string}

export class GooglePhotos implements ITransfer {
  private settings:GooglePhotosSettings

  constructor(settings:GooglePhotosSettings) {
    this.settings = settings
  }

  public async transfer (file:string, dir:string) {
    if (!this.settings.enabled) return

    console.log('Getting new auth token')
    const auth = new Auth.OAuth2Client({
      clientId: this.settings.clientId,
      clientSecret: this.settings.clientSecret
    })
    auth.setCredentials({
      refresh_token: this.settings.refreshToken
    })
    
    const {token} = await auth.getAccessToken()
    const albumId = this.settings.albumId || await this.getAlbumIdByName(token as string, this.settings.albumName || "Dashcam Videos")
    const photos = new Photos(token)
    console.log(`Uploading file ${file} to Google Photos Album ${albumId}`)
    await photos.mediaItems.upload(albumId, file, `${dir}/${file}`)
    console.log('Upload complete to Google Photos', file)
  }

  private async getAlbumIdByName (authToken:string, albumName:string, pageToken?:string):Promise<string> {
    const photos = new Photos(authToken)
    const result = await photos.albums.list(50, pageToken)
    
    let album = result.albums.find((a:any) => a.title === albumName)

    if (album) {
      console.log(`Found album ${albumName} with id ${album.id}`)
      return album.id
    }
    else if (result.nextPageToken) {
      console.log(`Still looking for album ${albumName}...`)
      return this.getAlbumIdByName(authToken, albumName, result.nextPageToken)
    }
    else {
      album = await photos.albums.create(albumName)
      console.log(`Created new album ${albumName} with id ${album.id}`)
      return album.id
    }
  }
}

async function setup() {
  prompt.start();

  const settings = await Settings.getGooglePhotosSettings()
  
  if (!settings.refreshToken) {
    settings.clientId = settings.clientId || (await prompt.get(['CLIENT_ID'])).CLIENT_ID;
    settings.clientSecret = settings.clientSecret || (await prompt.get(['CLIENT_SECRET'])).CLIENT_SECRET;
  
    const auth = new Auth.OAuth2Client({
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
      redirectUri: 'https://www.google.com/'
    }) 
    const url = auth.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/photoslibrary'
      ],
    })
    console.log('Use this url and get the code from return URL parameter', url)
    const code = unescape((await prompt.get(['code'])).code)
    console.log(`Getting new auth token for code ${code}`)
    const result = await auth.getToken(code)
    console.log(result)
    settings.refreshToken = result.tokens.refresh_token || ''
  }
}