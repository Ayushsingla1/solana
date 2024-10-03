import { Connection,clusterApiUrl ,Transaction, PublicKey, sendAndConfirmTransaction} from "@solana/web3.js";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config"
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
const user = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(clusterApiUrl("devnet"));

console.log("Public key of user is : " , user.publicKey)
const tokenMintAccount = new PublicKey("AfYDP49QfF5BcdAsbozzoJ7PZ98wLdhkwTVUbzkgsrVr")
const transaction = new Transaction();

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

const metadataData = {
    name : "AS Blaster",
    symbol : "fire in eyes",
    uri : "https://arweave.net/1234",
    sellerFeeBasisPoints : 0,
    uses : null,
    collection : null ,
    creators : null, 
}

const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
   
  const metadataPDA = metadataPDAAndBump[0];

  const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadataData,
        isMutable: true,
      },
    },
  );

  transaction.add(createMetadataAccountInstruction);

  const transact = async()=>{
    const res = await sendAndConfirmTransaction(connection,transaction,[user]);
    console.log(res);
    const transactionLink = getExplorerLink("transaction",res.toString(),"devnet");
    console.log("Link is " , transactionLink);
  }
  transact();