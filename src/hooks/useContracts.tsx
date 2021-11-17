import {
    useContractKit,
    useProvider,
    useProviderOrSigner
} from '@celo-tools/use-contractkit';
import { ethers, Contract } from 'ethers';
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
    delegate?: Contract;
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

            const donationMiner = new ethers.Contract(
                addresses.donationMiner,
                DonationMinerABI as any,
                signer
            );

            const cusd = new ethers.Contract(
                addresses.cusd,
                ApproveERC20ABI as any,
                signer
            );

            const pact = new ethers.Contract(
                addresses.pactToken,
                PACTToken as any,
                signer
            );

            const delegate = new ethers.Contract(
                addresses.delegate,
                PACTDelegate,
                signer
            ).attach(addresses.delegator);

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
