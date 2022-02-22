import { Contract } from '@ethersproject/contracts';
import CommunityABI from './abi/CommunityABI.json';
import type { Provider } from '@ethersproject/providers';
import type { Signer } from '@ethersproject/abstract-signer';

export const communityContract = (address: string, signerOrProvider?: Signer | Provider | undefined) => {
    return new Contract(address, CommunityABI, signerOrProvider);
};
