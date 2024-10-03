import {
    findMetadataPda,
    mplTokenMetadata,
    verifyCollectionV1,
  } from "@metaplex-foundation/mpl-token-metadata";
  import {
    keypairIdentity,
    publicKey as UMIPublicKey,
  } from "@metaplex-foundation/umi";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
  } from "@solana-developers/helpers";
  import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
   
  const connection = new Connection(clusterApiUrl("devnet"));

  const main = async()=>{
      const user = await getKeypairFromFile();
      console.log("Loaded user:", user.publicKey.toBase58());
       
      await airdropIfRequired(
        connection,
        user.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.1 * LAMPORTS_PER_SOL,
      );
       
      const umi = createUmi(connection);
      const umiKeyPair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
      umi
      .use(keypairIdentity(umiKeyPair))
      .use(mplTokenMetadata())
      
      const collectionAddress = UMIPublicKey("GE3ZdCPwFcRM6NM8sLapic9YzUQECz8fP2mz1iRQP2T8");
      const nftAddress = UMIPublicKey("56tWvvkbiXmYkq9PhW72NaYpAqGBA1Mkiq3giLzvX4FL");

        const metadata = findMetadataPda(umi, { mint: nftAddress });
        await verifyCollectionV1(umi, {
        metadata,
        collectionMint: collectionAddress,
        authority: umi.identity,
        }).sendAndConfirm(umi);
        
        let explorerLink = getExplorerLink("address", nftAddress, "devnet");
        console.log(`verified collection:  ${explorerLink}`);
        console.log("✅ Finished successfully!");
  }

  main();