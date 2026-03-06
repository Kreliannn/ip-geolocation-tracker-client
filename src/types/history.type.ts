export interface historyInterfaceInput {
    user : string,
    searchedAt : string,
    ip: string,
}



export  interface historyInterface extends historyInterfaceInput {
    _id : string,
}