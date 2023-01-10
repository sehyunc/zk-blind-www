// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  configureChains,
  createClient,
  goerli,
  readContract,
} from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { publicProvider } from "@wagmi/core/providers/public";
import type { NextApiRequest, NextApiResponse } from "next";
const snarkjs = require("snarkjs");

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
  webSocketProvider,
});

type Data = {
  valid: boolean;
};
const input = {
  x: "1764",
};

const abi = [
  {
    inputs: [
      { internalType: "uint256[2]", name: "a", type: "uint256[2]" },
      { internalType: "uint256[2][2]", name: "b", type: "uint256[2][2]" },
      { internalType: "uint256[2]", name: "c", type: "uint256[2]" },
      { internalType: "uint256[1]", name: "input", type: "uint256[1]" },
    ],
    name: "verifyProof",
    outputs: [{ internalType: "bool", name: "r", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "/Users/sehyun/code/zk-email-verify/src/helpers/hash.wasm",
    "/Users/sehyun/code/zk-email-verify/src/helpers/hash.zkey"
  );
  // console.log("proof", proof);
  // console.log("publicSignals", publicSignals);

  const data = await readContract({
    address: "0x7a0fFBF0bd9032Baa4ecF06541BfE422B9f62978",
    abi,
    functionName: "verifyProof",
    args: [
      [
        "0x05c6b8c5586d473ac18f166c7293f179ae321aa66eb7781a566e18b18cfa201c",
        "0x16110cdea1999b371f1039b80c02c46bd0497ae24370ea1ca589f4957bf6bcfb",
      ],
      [
        [
          "0x11e07b2879b5d400ef3e59b6298470064446162010cb949e58a734c0ac731474",
          "0x1b4b93e61b502d005f4ddcf5fecd48c0c362acac0c055cc8e0c15a2070ce0d69",
        ],
        [
          "0x2e7b01faa29c857f5074afcecaca244a0a298c2bd21bbe78a1dc8e571c2317fa",
          "0x02f3c03c5f3b778c1e5364ccfada6a8216eb7f477c698d33106571727e4845ad",
        ],
      ],
      [
        "0x1eb2b326c3e0a3294718954d4a766000caba888e406e10a988ed568c81131aed",
        "0x2f67225076ddf6c1f269bbca617d635eec458b44b0eae9fdb070d1b228d13a29",
      ],
      ["0x2323966c7385a437ec039864aa44a153587a402717f8bfe53741eb490f9935c8"],
    ],
  });
  // console.log("🚀 ~ data", data);
  const inputs = await fetch("http://localhost:3000/api/generate-input", {
    method: "POST",
    body: JSON.stringify({ a: 1, b: "Textual content" }),
  }).then((res) => res.json());
  // console.log(inputs);

  res.status(200).json({ valid: data as boolean });
}
