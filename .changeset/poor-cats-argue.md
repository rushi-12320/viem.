---
"viem": minor
---

Added `factory` & `factoryData` parameters to `call` & `readContract` to enable "deployless counterfactual calls" (calling a function on a contract which has not been deployed). 

This is particularly useful for the use case of calling functions on [ERC-4337 Smart Accounts](https://eips.ethereum.org/EIPS/eip-4337) that have not been deployed yet.
