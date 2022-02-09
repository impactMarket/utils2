import React, { useEffect, useState } from 'react';
import { hasPACTVotingPower } from '@impact-market/utils/pact'
import { useProvider, useContractKit } from '@celo-tools/use-contractkit';

const VotingPower = () => {
    const provider = useProvider();
    const { address } = useContractKit();
    const [hasVotingPower, setHasVotingPower] = useState(false);

    useEffect(() => {
        if (address) {
            hasPACTVotingPower(provider, address).then((has) => setHasVotingPower(has));
        }
    }, [address, provider]);

    return (
        <div>
            <h3>Voting Power</h3>
            enough voting power to propose: {hasVotingPower.toString()}
        </div>
    );
}

export default VotingPower;
