import React, { useEffect, useState } from 'react';
import { useCaskFi } from '@impact-market/utils/useCaskFi';
import WalletConnection from '../WalletConnection';

const CaskFi = () => {
    const { isReady, changeFundingSource, subscribe, getPlans, getConsumerSubscriptionsDetails } = useCaskFi({
        pinataApiKey: process.env.NEXT_PUBLIC_PINATE_API_KEY!,
        pinataApiSecret: process.env.NEXT_PUBLIC_PINATE_API_SECRET!,
    });
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            if (isReady) {
                const plans_ = await getPlans();
                setPlans(plans_);
            }
        };

        load();
    }, [isReady]);

    return (
        <WalletConnection title="CaskFi">
            <button onClick={() => getConsumerSubscriptionsDetails().then(console.log)}>
                getConsumerSubscriptionsDetails
            </button>
            <br />
            <button onClick={() => getPlans().then(console.log)}>getPlans</button>
            <br />
            <button onClick={() => changeFundingSource().then(console.log)}>changeFundingSource</button>
            <br />
            <ul>
                {plans.map(plan => (
                    <li key={plan.planId}>
                        <button onClick={() => subscribe(plan.planId).then(console.log)}>
                            subscribe ({plan.planId}) {plan.name}
                        </button>
                    </li>
                ))}
            </ul>
        </WalletConnection>
    );
};

export default CaskFi;
