import { Contract } from '@ethersproject/contracts';
import { ContractAddresses } from './contractAddress';
import AmbassadorsABI from './abi/Ambassadors.json';
import BaseERC20ABI from './abi/BaseERC20.json';
import DonationMinerABI from './abi/DonationMiner.json';
import DonationMinerOldABI from './abi/DonationMinerOld.json';
import ImpactMarketCouncilABI from './abi/ImpactMarketCouncil.json';
import MerkleDistributorABI from './abi/MerkleDistributor.json';
import PACTDelegateABI from './abi/PACTDelegate.json';
import PACTTokenABI from './abi/PACTToken.json';
import StakingABI from './abi/Staking.json';
import type { BaseProvider } from '@ethersproject/providers';

export const getContracts = async (provider: BaseProvider) => {
    // do not request the network, if information exists
    let chainId = provider.network?.chainId;

    if (!chainId) {
        const _network = await provider?.getNetwork();

        chainId = _network?.chainId;
    }
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { Ambassadors, CommunityAdmin, cUSD, PACTDelegate, PACTDelegator, PACTToken, SPACTToken, DonationMiner, MerkleDistributor, Staking, ImpactMarketCouncil } =
        contractAddresses;

    const addresses = {
        ambassadors: Ambassadors || '',
        communityAdmin: CommunityAdmin || '',
        cusd: cUSD || '',
        delegate: PACTDelegate || '',
        delegator: PACTDelegator || '',
        donationMiner: DonationMiner || '',
        impactMarketCouncil: ImpactMarketCouncil || '',
        merkleDistributor: MerkleDistributor || '',
        pactToken: PACTToken || '',
        spactToken: SPACTToken || '',
        staking: Staking || ''
    };

    const ambassadors = new Contract(addresses.ambassadors, AmbassadorsABI, provider);
    
    const merkleDistributor = new Contract(addresses.merkleDistributor, MerkleDistributorABI, provider);

    const donationMinerOld = new Contract(addresses.donationMiner, DonationMinerOldABI, provider);
    const donationMiner = new Contract(addresses.donationMiner, DonationMinerABI, provider);

    const cusd = new Contract(addresses.cusd, BaseERC20ABI, provider);

    const pact = new Contract(addresses.pactToken, PACTTokenABI, provider);
    
    const spact = new Contract(addresses.spactToken, BaseERC20ABI, provider);

    const staking = new Contract(addresses.staking, StakingABI, provider);

    const delegate = new Contract(addresses.delegate, PACTDelegateABI, provider).attach(addresses.delegator);
    
    const impactMarketCouncil = new Contract(addresses.impactMarketCouncil, ImpactMarketCouncilABI, provider);

    return {
        addresses,
        ambassadors,
        cusd,
        delegate,
        donationMiner,
        donationMinerOld,
        impactMarketCouncil,
        merkleDistributor,
        pact,
        spact,
        staking
    };
};
