import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { Connection,PublicKey,clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { send } from "process";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

const receiver = new PublicKey("6boFraNKs6pxLcjpHUHE2HnrV97WU1vxCZVyGg1Bc6oV")
const MintTokenAccount = new PublicKey("AfYDP49QfF5BcdAsbozzoJ7PZ98wLdhkwTVUbzkgsrVr");

const sending = async()=>{
    const senderAssociatedAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        MintTokenAccount,
        user.publicKey
    )
    console.log("sender associated account is : " , senderAssociatedAccount.address);
    
    const receiverAssociatedAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        MintTokenAccount,
        receiver
    )

    console.log("receiver associated account is : " , receiverAssociatedAccount.address)
    const signature = await transfer(
        connection,
        user,
        senderAssociatedAccount.address,
        receiverAssociatedAccount.address,
        user,
        100
    )
    console.log(signature);
    const explorer = getExplorerLink("transaction",signature,"devnet");
    console.log(explorer)
}

sending();
