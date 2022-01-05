import { Signer } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';
import { ContractAddresses } from '../contracts';
import BaseERC20ABI from '../contracts/abi/BaseERC20.json';
import DonationMinerABI from '../contracts/abi/DonationMiner.json';
import PACTTokenABI from '../contracts/abi/PACTToken.json';
import PACTDelegateABI from '../contracts/abi/PACTDelegate.json';
import { PACTDelegate } from '../types/contracts/PACTDelegate';
import { PACTToken } from '../types/contracts/PACTToken';
import MerkleDistributorABI from '../contracts/abi/MerkleDistributor.json';

export const getContracts = async (
    provider: BaseProvider,
    signer: Signer | null
) => {
    const { chainId } = await provider.getNetwork();
    const contractAddresses = ContractAddresses.get(chainId)!;

    const {
        CommunityAdmin,
        cUSD,
        PACTDelegate,
        PACTDelegator,
        PACTToken,
        DonationMiner,
        MerkleDistributor
    } = contractAddresses;

    const addresses = {
        communityAdmin: CommunityAdmin || '',
        cusd: cUSD || '',
        delegate: PACTDelegate || '',
        delegator: PACTDelegator || '',
        donationMiner: DonationMiner || '',
        pactToken: PACTToken || '',
        merkleDistributor: MerkleDistributor || ''
    };

    const _signerOrProvider = signer || provider || undefined;

    const merkleDistributor = new Contract(
        addresses.merkleDistributor,
        MerkleDistributorABI,
        _signerOrProvider
    );

    const donationMiner = new Contract(
        addresses.donationMiner,
        DonationMinerABI,
        _signerOrProvider
    );

    const cusd = new Contract(addresses.cusd, BaseERC20ABI, _signerOrProvider);

    const pact = new Contract(
        addresses.pactToken,
        PACTTokenABI,
        _signerOrProvider
    ) as Contract & PACTToken;

    const delegate = new Contract(
        addresses.delegate,
        PACTDelegateABI,
        _signerOrProvider
    ).attach(addresses.delegator) as Contract & PACTDelegate;

    return {
        addresses,
        cusd,
        delegate,
        donationMiner,
        pact,
        merkleDistributor
    };
};
