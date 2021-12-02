import { useContractKit } from '@celo-tools/use-contractkit';
import React, { useEffect, useState } from 'react';
import { ContractAddresses } from '../contracts';
import BaseERC20ABI from '../contracts/abi/BaseERC20.json';
import DonationMinerABI from '../contracts/abi/DonationMiner.json';
import PACTTokenABI from '../contracts/abi/PACTToken.json';
import PACTDelegate from '../contracts/abi/PACTDelegate.json';
import { IPCTDelegate } from '../types/contracts/IPCTDelegate';
import { Contract } from '@ethersproject/contracts';
import { PACTToken } from '../types/contracts/PACTToken';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

type ContractsType = {
    addresses?: {
        communityAdmin?: string;
        cusd?: string;
        delegate?: string;
        delegator?: string;
        donationMiner?: string;
        pactToken?: string;
    };
    cusd?: Contract;
    delegate?: Contract & IPCTDelegate;
    donationMiner?: Contract;
    pact?: Contract & PACTToken;
};

const initialContractsState = {
    addresses: undefined,
    cusd: undefined,
    delegate: undefined,
    donationMiner: undefined,
    pact: undefined
};

export const useContracts = () => {
    const { initialised } = useContractKit();

    const [contracts, setContracts] = useState<ContractsType>(
        initialContractsState
    );
    const { address, signer, provider } = React.useContext(ImpactMarketContext);

    useEffect(() => {
        const getContracts = async () => {
            const network = await provider?.getNetwork();

            const addresses = {
                communityAdmin:
                    ContractAddresses.get(network?.chainId!)?.CommunityAdmin ||
                    '',
                cusd: ContractAddresses.get(network?.chainId!)?.cUSD || '',
                delegate:
                    ContractAddresses.get(network?.chainId!)?.PACTDelegate ||
                    '',
                delegator:
                    ContractAddresses.get(network?.chainId!)?.PACTDelegator ||
                    '',
                donationMiner:
                    ContractAddresses.get(network?.chainId!)?.DonationMiner ||
                    '',
                pactToken:
                    ContractAddresses.get(network?.chainId!)?.PACTToken || ''
            };
            const _signer = signer || undefined;

            const donationMiner = new Contract(
                addresses.donationMiner,
                DonationMinerABI,
                _signer
            );

            const cusd = new Contract(addresses.cusd, BaseERC20ABI, _signer);

            const pact = new Contract(
                addresses.pactToken,
                PACTTokenABI,
                _signer
            ) as Contract & PACTToken;

            const delegate = new Contract(
                addresses.delegate,
                PACTDelegate,
                _signer
            ).attach(addresses.delegator) as Contract & IPCTDelegate;

            setContracts({
                addresses,
                cusd,
                delegate,
                donationMiner,
                pact
            });
        };

        if (!!address && initialised) {
            getContracts();
        }
    }, [address, initialised, provider, signer]);

    return contracts;
};
