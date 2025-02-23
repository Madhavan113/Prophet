// frontend/src/config/Web3Config.jsx
import { Web3Modal } from "@web3modal/standalone";

const web3Modal = new Web3Modal({
  providerOptions: {
    metamask: {
      id: "metamask",
      type: "wallet",
      package: "metaMaskInPageProvider",
    },
  },
});

export default web3Modal;
