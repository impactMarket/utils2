import React, { useEffect, useState } from 'react';
import { ContractAddresses } from '../contracts';
import BaseERC20ABI from '../contracts/abi/BaseERC20.json';
import DonationMinerABI from '../contracts/abi/DonationMiner.json';
import PACTTokenABI from '../contracts/abi/PACTToken.json';
import PACTDelegateABI from '../contracts/abi/PACTDelegate.json';
import { IPCTDelegate } from '../types/contracts/IPCTDelegate';
import { Contract } from '@ethersproject/contracts';
import { PACTToken } from '../types/contracts/PACTToken';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import MerkleDistributorABI from '../contracts/abi/MerkleDistributor.json';

type ContractsType = {
    addresses?: {
        communityAdmin?: string;
        cusd?: string;
        delegate?: string;
        delegator?: string;
        donationMiner?: string;
        pactToken?: string;
        merkleDistributor?: string;
    };
    cusd?: Contract;
    delegate?: Contract & IPCTDelegate;
    donationMiner?: Contract;
    pact?: Contract & PACTToken;
    merkleDistributor?: Contract;
};

const initialContractsState = {
    addresses: undefined,
    cusd: undefined,
    delegate: undefined,
    donationMiner: undefined,
    pact: undefined,
    merkleDistributor: undefined
};

export const useContracts = () => {
    const [contracts, setContracts] = useState<ContractsType>(
        initialContractsState
    );
    const { signer, provider } = React.useContext(ImpactMarketContext);

    useEffect(() => {
        const getContracts = async () => {
            const network = await provider.getNetwork();
            const contractAddresses = ContractAddresses.get(network.chainId)!;

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

            const cusd = new Contract(
                addresses.cusd,
                BaseERC20ABI,
                _signerOrProvider
            );

            const pact = new Contract(
                addresses.pactToken,
                PACTTokenABI,
                _signerOrProvider
            ) as Contract & PACTToken;

            const delegate = new Contract(
                addresses.delegate,
                PACTDelegateABI,
                _signerOrProvider
            ).attach(addresses.delegator) as Contract & IPCTDelegate;

            setContracts({
                addresses,
                cusd,
                delegate,
                donationMiner,
                pact,
                merkleDistributor
            });
        };

        if (provider) {
            getContracts();
        }
    }, [provider, signer]);

    return contracts;
};
