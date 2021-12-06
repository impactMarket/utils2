import { Contract } from '@ethersproject/contracts';
import CommunityABI from '../contracts/abi/CommunityABI.json';
import { Community } from '../types/contracts/Community';

export const communityContract = (address: string) => {
    return new Contract(address, CommunityABI) as Contract & Community;
};
