import React, { useEffect, useState } from 'react';
import { hasPACTVotingPower } from '@impact-market/utils/pact';
import { useProvider, useCelo } from '@celo/react-celo';

const VotingPower = () => {
    const provider = useProvider();
    const { address } = useCelo();
    const [hasVotingPower, setHasVotingPower] = useState(false);

    useEffect(() => {
        if (address) {
            hasPACTVotingPower(provider, 44787, address).then(has => setHasVotingPower(!!has));
        }
    }, [address, provider]);

    return (
        <div>
            <h3>Voting Power</h3>
            enough voting power to propose: {hasVotingPower.toString()}
        </div>
    );
};

export default VotingPower;
