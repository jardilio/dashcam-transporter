import SambaClient from 'samba-client'
import { ITransfer } from './ITransfer';

export class SMB implements ITransfer {
  private settings:any
  private client:SambaClient

  constructor(settings:any) {
    this.settings = settings
    this.client = new SambaClient({
      address: `\\\\${settings.host}\\home`,
      username: settings.username,
      password: settings.password
    })
  }

  public async transfer(file:string, dir:string) {
    if (!this.settings.enabled) return

    if (!await this.client.fileExists('dashcam-transfer')) {
      await this.client.mkdir('dashcam-transfer')
      await this.client.mkdir('dashcam-transfer\\locked')
    }

    console.log('Uploading file to smb', file)
    await this.client.sendFile(`${dir}/${file}`, `dashcam-transfer\\locked\\${file}`)
    console.log('Upload complete to smb', file)
  }
}
