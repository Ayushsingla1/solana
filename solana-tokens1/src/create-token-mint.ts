import { createMint } from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromEnvironment ,getExplorerLink } from "@solana-developers/helpers";
import { Connection,clusterApiUrl } from "@solana/web3.js";


const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY")
console.log(user.publicKey.toBase58())
const tokenmintfn = async()=>{
    const res =  await createMint(
        connection,
        user,
        user.publicKey,
        null,
        2
    )
    const link = getExplorerLink("address",res.toString(),"devnet")
    console.log(`mint created successfully at address ${link}`)
}
tokenmintfn();