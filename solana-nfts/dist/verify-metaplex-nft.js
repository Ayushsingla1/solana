"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const helpers_1 = require("@solana-developers/helpers");
const web3_js_1 = require("@solana/web3.js");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, helpers_1.getKeypairFromFile)();
    console.log("Loaded user:", user.publicKey.toBase58());
    yield (0, helpers_1.airdropIfRequired)(connection, user.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL, 0.1 * web3_js_1.LAMPORTS_PER_SOL);
    const umi = (0, umi_bundle_defaults_1.createUmi)(connection);
    const umiKeyPair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    umi
        .use((0, umi_1.keypairIdentity)(umiKeyPair))
        .use((0, mpl_token_metadata_1.mplTokenMetadata)());
    const collectionAddress = (0, umi_1.publicKey)("GE3ZdCPwFcRM6NM8sLapic9YzUQECz8fP2mz1iRQP2T8");
    const nftAddress = (0, umi_1.publicKey)("56tWvvkbiXmYkq9PhW72NaYpAqGBA1Mkiq3giLzvX4FL");
    const metadata = (0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: nftAddress });
    yield (0, mpl_token_metadata_1.verifyCollectionV1)(umi, {
        metadata,
        collectionMint: collectionAddress,
        authority: umi.identity,
    }).sendAndConfirm(umi);
    let explorerLink = (0, helpers_1.getExplorerLink)("address", nftAddress, "devnet");
    console.log(`verified collection:  ${explorerLink}`);
    console.log("✅ Finished successfully!");
});
main();
