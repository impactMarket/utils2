import {
    useContractKit,
    useProvider,
    useProviderOrSigner
} from '@celo-tools/use-contractkit';
import { useEffect, useState } from 'react';
import {
    ContractAddresses,
    cusdContractAddress,
    pactContractAddress
} from '../contracts';
import ApproveERC20ABI from '../contracts/abi/ApproveERC20.json';
import DonationMinerABI from '../contracts/abi/DonationMiner.json';
import PACTToken from '../contracts/abi/PACTToken.json';
import PACTDelegate from '../contracts/abi/PACTDelegate.json';
import { IPCTDelegate } from '../types/contracts/IPCTDelegate';
import { Contract } from '@ethersproject/contracts';

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
    pact?: Contract;
};

const initialContractsState = {
    addresses: undefined,
    cusd: undefined,
    delegate: undefined,
    donationMiner: undefined,
    pact: undefined
};

export const useContracts = () => {
    const provider = useProvider();
    const signer = useProviderOrSigner();
    const { address, initialised } = useContractKit();

    const [contracts, setContracts] = useState<ContractsType>(
        initialContractsState
    );

    useEffect(() => {
        const getContracts = async () => {
            const network = await provider?.getNetwork();

            const addresses = {
                communityAdmin:
                    ContractAddresses.get(network?.chainId!)?.CommunityAdmin ||
                    '',
                cusd: cusdContractAddress,
                delegate:
                    ContractAddresses.get(network?.chainId!)?.PACTDelegate ||
                    '',
                delegator:
                    ContractAddresses.get(network?.chainId!)?.PACTDelegator ||
                    '',
                donationMiner:
                    ContractAddresses.get(network?.chainId!)?.DonationMiner ||
                    '',
                pactToken: pactContractAddress
            };

            const donationMiner = new Contract(
                addresses.donationMiner,
                DonationMinerABI,
                signer
            );

            const cusd = new Contract(addresses.cusd, ApproveERC20ABI, signer);

            const pact = new Contract(addresses.pactToken, PACTToken, signer);

            const delegate = new Contract(
                addresses.delegate,
                PACTDelegate,
                signer
            ).attach(addresses.delegator) as Contract & IPCTDelegate;

            setContracts({
                addresses,
                cusd,
                delegate,
                donationMiner,
                pact
            });
        };

        if (!!address && initialised && !!signer) {
            getContracts();
        }
    }, [address, initialised, provider, signer]);

    return contracts;
};
