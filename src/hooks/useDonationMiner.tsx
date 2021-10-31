import { useBalance } from './useBalance';
import { useContractKit } from '@celo-tools/use-contractkit';
import { useContracts } from './useContracts';
import { useEpoch } from './useEpoch';
import { useRewards } from './useRewards';
import { toToken } from '../helpers/toToken';

type DonationMinerType = {
    approve?: Function;
    donate?: Function;
};

export const useDonationMiner = (): DonationMinerType => {
    const { address, kit } = useContractKit();
    const { donationMiner } = useContracts();
    const { updateRewards } = useRewards();
    const { updateBalance } = useBalance();
    const { updateEpoch } = useEpoch();

    const approve = async (value: string | number) => {
        try {
            const amount = toToken(value);

            if (!donationMiner?.address || !address || !amount || !kit) {
                return;
            }

            await kit.setFeeCurrency('StableToken' as any);
            const stable = await kit.contracts.getStableToken();
            const allowance = await stable.allowance(
                address,
                donationMiner.address
            );

            if (allowance.gte(amount)) {
                return { status: true };
            }

            const tx = await stable
                .approve(donationMiner.address, amount)
                .send();

            return await tx.waitReceipt();
        } catch (error) {
            console.log('Error approving amount: \n', error);

            return { status: false };
        }
    };

    const donate = async (value: string | number) => {
        try {
            const amount = toToken(value);
            const tx = await donationMiner?.donate(amount);
            const response = await tx.wait();

            await updateBalance();
            await updateRewards();
            await updateEpoch();

            return response;
        } catch (error) {
            console.log('Error in donate function: \n', error);
        }
    };

    return {
        approve,
        donate
    };
};
