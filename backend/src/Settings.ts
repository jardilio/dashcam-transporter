import propertiesReader from 'properties-reader'

// eslint-disable-next-line n/no-path-concat
const properties = propertiesReader(__dirname + '/settings.ini')

export class Settings {
  public static async getDashcamWifiSSID () {
    return properties.get('dashcam.ssid') as string
  }

  public static async getDashcamWifiPassword () {
    return properties.get('dashcam.password') as string
  }

  public static async getDashcamModel () {
    let model = properties.get('dashcam.model') as string
    model = model ?? 'VIOFOA199MINI'
    return model
  }

  public static async getHomeWifiSSID () {
    return properties.get('home.ssid') as string
  }

  public static async getHomeWifiPassword () {
    return properties.get('home.password') as string
  }

  public static async getDownloadDirectory () {
    return '/opt/videodownload'
  }

  public static async getSMBSettings () {
    return {
      enabled: properties.get('smb.enabled') as boolean,
      host: properties.get('smb.host') as string,
      username: properties.get('smb.username') as string,
      password: properties.get('smb.password') as string,
      storagePath: properties.get('smb.storagepath') as string
    }
  }

  public static async getGooglePhotosSettings () {
    return {
      enabled: properties.get('googlephotos.enabled') as boolean,
      refreshToken: properties.get('googlephotos.refreshToken') as string,
      albumId: properties.get('googlephotos.albumId') as string,
      albumName: properties.get('googlephotos.albumName') as string,
      clientId: properties.get('googlephotos.clientId') as string,
      clientSecret: properties.get('googlephotos.clientSecret') as string
    }
  }
}
