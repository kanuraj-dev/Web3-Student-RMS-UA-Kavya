import { goto } from "$app/navigation";
import { toast } from "$lib/store/toast";
import type { ContractReceipt } from "ethers";
import { contracts } from "svelte-ethers-store";
import { signerAddress } from "svelte-ethers-store";

const showToast = (msg: string) => {
  if (msg.startsWith("Error: processing response error")) {
    toast({
      message: "Please connect your wallet first to start using the records.",
      type: "info",
    });
  } else if (msg === "Internal JSON-RPC error.") {
    toast({
      message:
        "You don't have sufficient Ethereum balance. Please add funds to your account",
      type: "info",
    });
  } else {
    toast({
      message: msg,
      type: "error",
    });
  }
};

export const contractTransact = async (
  methodName: string,
  args: any[],
  options: any = {}
) => {
  let isConnected = localStorage.getItem("connected") === "true";

  if (!isConnected) {
    toast({
      message: "Please connect your wallet first to start using the records.",
      type: "info",
    });
    return goto(`/connect?redirect=${window.location.pathname}`);
  }

  const contractResponse: Promise<ContractReceipt | null> = new Promise(
    (resolve) => {
      const unsubscribe = contracts.subscribe(async (c) => {
        console.log(c, methodName, args, options);
        try {
          const result = await c.recordsContract[methodName](...args, options);
          resolve((await result.wait()) as ContractReceipt);
        } catch (e: any) {
          console.log(e);
          showToast(e.message);

          console.error({ type: "ERROR IN CONTRACT TRANSACT", message: e });
          resolve(null);
        }
      });
      unsubscribe();
    }
  );

  return await contractResponse;
};
