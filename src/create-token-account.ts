import { Connection,clusterApiUrl,Transaction, PublicKey } from "@solana/web3.js";
import "dotenv/config"
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
const user = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(clusterApiUrl("devnet"));
const mint = new PublicKey("AfYDP49QfF5BcdAsbozzoJ7PZ98wLdhkwTVUbzkgsrVr")
console.log(user.publicKey);


const acc = async()=> {

const AssocTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mint,
    user.publicKey
)
console.log(AssocTokenAccount);
console.log(getExplorerLink("address",AssocTokenAccount.address.toBase58(),"devnet"));
}

acc();