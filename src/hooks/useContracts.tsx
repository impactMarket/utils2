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

type ContractsType = {
    cusd?: Contract;
    donationMiner?: Contract;
    pact?: Contract;
};

const initialContractsState = {
    cusd: undefined,
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

            const donationMinerContractAddress =
                ContractAddresses.get(network?.chainId!)?.DonationMiner || '';

            const donationMiner = new ethers.Contract(
                donationMinerContractAddress,
                DonationMinerABI as any,
                signer
            );

            const cusd = new ethers.Contract(
                cusdContractAddress,
                ApproveERC20ABI as any,
                signer
            );

            const pact = new ethers.Contract(
                pactContractAddress,
                PACTToken as any,
                signer
            );

            setContracts({ cusd, donationMiner, pact });
        };

        if (!!address && initialised && !!signer) {
            getContracts();
        }
    }, [address, initialised, provider, signer]);

    return contracts;
};
