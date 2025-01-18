export interface ITransfer {
    transfer(file:string, dir:string):Promise<void>
}