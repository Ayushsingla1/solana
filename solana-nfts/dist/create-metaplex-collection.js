"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const helpers_1 = require("@solana-developers/helpers");
const web3_js_1 = require("@solana/web3.js");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const umi_2 = require("@metaplex-foundation/umi");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const getUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, helpers_1.getKeypairFromFile)();
    yield (0, helpers_1.airdropIfRequired)(connection, user.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL, 0.1 * web3_js_1.LAMPORTS_PER_SOL);
    console.log("user is : ", user.publicKey.toBase58());
    const umi = (0, umi_bundle_defaults_1.createUmi)(connection);
    const umiKeyPair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    const pinataApiKey = '58c1ea9a8b26949a1c7c';
    const pinataSecretApiKey = '4e8ae54705c4e5476182ac9a47a6829d3a45da63d2e9f5307d553d066adbe073';
    umi.use((0, umi_1.keypairIdentity)(umiKeyPair)).use((0, mpl_token_metadata_1.mplTokenMetadata)());
    const uploadToPinata = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
        const fileBuffer = yield fs_1.promises.readFile(filePath);
        const fileName = path.basename(filePath);
        const formData = new FormData();
        const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
        formData.append('file', fileBlob, fileName);
        const response = yield axios_1.default.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: Number.MAX_VALUE,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey,
            },
        });
        console.log("File Uploaded to Pinata: ", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    });
    const uploadJsonToPinata = (jsonData) => __awaiter(void 0, void 0, void 0, function* () {
        const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', jsonBlob, 'metadata.json');
        const response = yield axios_1.default.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: Number.MAX_VALUE,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey,
            },
        });
        console.log("JSON Uploaded to Pinata: ", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    });
    const collectionImagePath = path.resolve(__dirname, "collection.png");
    const image = yield uploadToPinata(collectionImagePath);
    const jsonMetadata = {
        name: "My Collection",
        symbol: "MC",
        description: "My Collection description",
        image,
    };
    const uri = yield uploadJsonToPinata(jsonMetadata);
    const collectionMint = (0, umi_1.generateSigner)(umi);
    yield (0, mpl_token_metadata_1.createNft)(umi, {
        mint: collectionMint,
        name: "siuu7",
        uri,
        updateAuthority: umi.identity.publicKey,
        sellerFeeBasisPoints: (0, umi_2.percentAmount)(0),
        isCollection: true,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });
    const explorerLink = (0, helpers_1.getExplorerLink)("address", collectionMint.publicKey, "devnet");
    console.log(`Collection NFT:  ${explorerLink}`);
    console.log(`Collection NFT address is:`, collectionMint.publicKey);
    console.log("✅ Finished successfully!");
});
getUser();
