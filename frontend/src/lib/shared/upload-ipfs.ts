// import { WEB3STORAGE_TOKEN } from "$env/static/private";
import { File, Web3Storage } from "web3.storage";
import { errorSafeFetch } from "./utils";

export const uploadToIPFS = async (ipfsData: Record<string, string>) => {
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU1QzQ5RGRDM0Q3MzY1RjYzQWY1MDk0RDA3ZTAwNzBkNjVFN2MyOEMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODI5NDg5NTgyNjYsIm5hbWUiOiJXZWIgRGV2bG9wZXIgRGhhcmFtaWsifQ.W8VRHdcFaaBYPxjWnqetbeOEGM6tIqs9JPQ7n6zPmXg",
  });

  const jsonFile = new File([JSON.stringify(ipfsData)], "data.json", {
    type: "application/json",
  });

  const cid = await client.put([jsonFile]);
  console.log("PINNED: ", cid);

  // used to populate cloudflare cache on pined json data
  errorSafeFetch(`https://${cid}.ipfs.w3s.link/data.json`);

  return cid;
};
