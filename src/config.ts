import { BigNumber } from 'bignumber.js';

export const subgraphCeloMainnet = 'https://gateway-arbitrum.network.thegraph.com/api/f11ae56fca9bda04e78d3534edfb8ac5/subgraphs/id/FwCDPF8TAUPmPdHsaz8WPWQ6f4SdHa7nVjyY25ZzF4LC';
export const subgraphCeloAlfajores = 'https://api.thegraph.com/subgraphs/name/impactmarket/alfajores-subgraph';

export const ubiManagementSubgraphCeloMainnet = 'https://gateway-arbitrum.network.thegraph.com/api/f11ae56fca9bda04e78d3534edfb8ac5/subgraphs/id/DLeoA3CxtWMrtG6x2R52xcwMsi9iQ46aB1h3akdFqVY4';
export const ubiManagementSubgraphCeloAlfajores =
    'https://api.thegraph.com/subgraphs/name/impactmarket/ubi-management-alfajores';

export const tokenDecimals = new BigNumber(10).pow(18);

export const networksId = {
    CeloAlfajores: 44787,
    CeloMainnet: 42220
};
