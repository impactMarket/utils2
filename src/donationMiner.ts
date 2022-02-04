import { toToken } from './toToken';
import { toNumber } from './toNumber';
import { getContracts } from './contracts';
import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';

export class DonationMiner {
    private provider: BaseProvider;
    private signer: Signer | null;
    private address: string;

    constructor(
        _provider: BaseProvider,
        _signer: Signer | null,
        _address: string
    ) {
        this.provider = _provider;
        this.signer = _signer;
        this.address = _address;
    }

    approve = async (value: string | number) => {
        try {
            const { cusd, donationMiner } = await getContracts(this.provider);
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            if (
                !this.address ||
                !this.signer ||
                !donationMiner?.provider ||
                !cusd?.provider ||
                !amount
            ) {
                return;
            }

            const cUSDAllowance = await cusd.allowance(
                this.address,
                donationMiner.address
            );
            const cusdAllowance = toNumber(cUSDAllowance);
            const allowance = cusdAllowance || 0;

            if (allowance >= Number(value)) {
                return { status: true };
            }

            const tx = await cusd
                .connect(this.signer)
                .approve(donationMiner.address, amount);
            const response = await tx.wait();

            // await updateCUSDBalance();

            return response;
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    donateToTreasury = async (value: string | number) => {
        try {
            if (!this.signer) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(this.provider);
            const tx = await donationMiner.connect(this.signer).donate(amount);
            const response = await tx.wait();

            // await updateCUSDBalance();
            // updateRewards();
            // updateEpoch();

            return response;
        } catch (error) {
            console.log('Error in donateToTreasury function: \n', error);
        }
    };

    donateToCommunity = async (community: string, value: string | number) => {
        try {
            if (!this.signer) {
                return;
            }
            const amount = toToken(value, { EXPONENTIAL_AT: 29 });
            const { donationMiner } = await getContracts(this.provider);
            const tx = await donationMiner
                .connect(this.signer)
                .donateToCommunity(community, amount);
            const response = await tx.wait();

            // await updateCUSDBalance();
            // updateRewards();
            // updateEpoch();

            return response;
        } catch (error) {
            console.log('Error in donateToCommunity function: \n', error);
        }
    };
}
