import { GlobalState } from './GlobalState'
import { SMB } from './hometransfert/SMB'
import { GooglePhotos } from './hometransfert/GooglePhotos'
import { RaspiLED } from './RaspiLed'
import fs from 'fs'
import { Settings } from './Settings'
import { ITransfer } from './hometransfert/ITransfer'

export class HomeTransfer {
  public static async transferToHome () {
    GlobalState.dashcamTransferDone = false
    RaspiLED.operation = 'HOMETRANSFER'

    const smb = new SMB(await Settings.getSMBSettings())
    const googlePhotos = new GooglePhotos(await Settings.getGooglePhotosSettings())
    const lockedFilesDirectory = await Settings.getDownloadDirectory() + '/locked'
    const lockedFiles = fs.readdirSync(lockedFilesDirectory)
    const uploads = []
    
    for (const file of lockedFiles) {
        uploads.push(HomeTransfer.processTransfer(smb, file, lockedFilesDirectory))
        uploads.push(HomeTransfer.processTransfer(googlePhotos, file, lockedFilesDirectory))
    }

    await Promise.all(uploads)
    
    GlobalState.homeTransferDone = true
    console.log('All files uploaded')
  }

  private static async processTransfer(transferer:ITransfer, file:string, dir:string) {
    return transferer.transfer(file, dir)
      .then(() => fs.unlinkSync(`lockedFilesDirectory/${file}`))
      .catch(e => console.log('Error transfering file', file, e))
  }
}
