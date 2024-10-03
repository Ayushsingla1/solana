import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { promises as fs } from "fs";
import * as path from "path";
import axios from "axios";
import { percentAmount } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const getUser = async () => {
  const user = await getKeypairFromFile();
  await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.1 * LAMPORTS_PER_SOL
  );
  console.log("user is : ", user.publicKey.toBase58());

  const umi = createUmi(connection);
  const umiKeyPair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

  const pinataApiKey = '58c1ea9a8b26949a1c7c';
  const pinataSecretApiKey = '4e8ae54705c4e5476182ac9a47a6829d3a45da63d2e9f5307d553d066adbe073';

  umi.use(keypairIdentity(umiKeyPair)).use(mplTokenMetadata());

  const uploadToPinata = async (filePath : any) => {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    const formData = new FormData();
    const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append('file', fileBlob, fileName);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Number.MAX_VALUE,
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    console.log("File Uploaded to Pinata: ", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  };

  const uploadJsonToPinata = async (jsonData : any) => {
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', jsonBlob, 'metadata.json');

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Number.MAX_VALUE,
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    console.log("JSON Uploaded to Pinata: ", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  };

  const collectionImagePath = path.resolve(__dirname, "collection.png");
  const image = await uploadToPinata(collectionImagePath); 

  const jsonMetadata = {
    name: "My Collection",
    symbol: "MC",
    description: "My Collection description",
    image,
  };

  const uri = await uploadJsonToPinata(jsonMetadata);

  const collectionMint = generateSigner(umi);
  
  await createNft(umi, {
    mint: collectionMint,
    name: "siuu7",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

  const explorerLink = getExplorerLink(
    "address",
    collectionMint.publicKey,
    "devnet"
  );
  console.log(`Collection NFT:  ${explorerLink}`);
  console.log(`Collection NFT address is:`, collectionMint.publicKey);
  console.log("✅ Finished successfully!");
};

getUser();
