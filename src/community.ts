import { Signer } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';
import CommunityABI from './abi/CommunityABI.json';

export const communityContract = (
    address: string,
    signerOrProvider?: Signer | Provider | undefined
) => {
    return new Contract(address, CommunityABI, signerOrProvider);
};
