import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";
import { Connection,clusterApiUrl,Transaction, PublicKey } from "@solana/web3.js";
import "dotenv/config"

const connection = new Connection(clusterApiUrl('devnet'));
const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(user.publicKey);
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10,2)
const AssociatedTokenAccount = new PublicKey("FQtEgTVszjaTgtTbzUjRPDo85ysYcUUvyUgNgLoMPgER")
const MintTokenAccount = new PublicKey("AfYDP49QfF5BcdAsbozzoJ7PZ98wLdhkwTVUbzkgsrVr");


const minting = async()=>{
    const res = await mintTo(
        connection,
        user,
        MintTokenAccount,
        AssociatedTokenAccount,
        user,
        10 * MINOR_UNITS_PER_MAJOR_UNITS
    
    )
    console.log(res);
    console.log("transaction",res,"devnet");
}

minting();