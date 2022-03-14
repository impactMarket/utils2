/* eslint-disable */
import { providers } from "ethers";
import { BaseProvider } from "./BaseProvider";

// An extension of BaseProvider that mimics StaticJsonRpcProvider to avoid
// unnecessary network traffic on static nodes
// See https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider
export class StaticBaseProvider extends BaseProvider {
  detectNetwork = providers.StaticJsonRpcProvider.prototype.detectNetwork;
}
