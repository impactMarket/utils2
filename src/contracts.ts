import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';
import { ContractAddresses } from './contractAddress';
import BaseERC20ABI from './abi/BaseERC20.json';
import DonationMinerABI from './abi/DonationMiner.json';
import PACTTokenABI from './abi/PACTToken.json';
import PACTDelegateABI from './abi/PACTDelegate.json';
import MerkleDistributorABI from './abi/MerkleDistributor.json';

export const getContracts = async (provider: BaseProvider) => {
    // do not request the network, if information exists
    let chainId = provider.network?.chainId;
    if (!chainId) {
        const _network = await provider?.getNetwork();
        chainId = _network?.chainId;
    }
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

    const merkleDistributor = new Contract(
        addresses.merkleDistributor,
        MerkleDistributorABI,
        provider
    );

    const donationMiner = new Contract(
        addresses.donationMiner,
        DonationMinerABI,
        provider
    );

    const cusd = new Contract(addresses.cusd, BaseERC20ABI, provider);

    const pact = new Contract(addresses.pactToken, PACTTokenABI, provider);

    const delegate = new Contract(
        addresses.delegate,
        PACTDelegateABI,
        provider
    ).attach(addresses.delegator);

    return {
        addresses,
        cusd,
        delegate,
        donationMiner,
        pact,
        merkleDistributor
    };
};
