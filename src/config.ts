import { BigNumber } from 'bignumber.js';

export const subgraphCeloMainnet = 'https://api.thegraph.com/subgraphs/name/impactmarket/subgraph';
export const subgraphCeloAlfajores = 'https://api.thegraph.com/subgraphs/name/impactmarket/alfajores-subgraph';

export const ubiManagementSubgraphCeloMainnet = 'https://api.thegraph.com/subgraphs/name/impactmarket/ubi-management';
export const ubiManagementSubgraphCeloAlfajores =
    'https://api.thegraph.com/subgraphs/name/impactmarket/ubi-management-alfajores';

export const tokenDecimals = new BigNumber(10).pow(18);
export const txFeeCStableThreshold = '0.005';
export const txFeeCELOThreshold = '0.003';

export const networksId = {
    CeloAlfajores: 44787,
    CeloMainnet: 42220
};
