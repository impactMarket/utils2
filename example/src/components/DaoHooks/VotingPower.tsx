import React from 'react';
import { useVotingPower } from '@impact-market/utils';

const VotingPower = props => {
    const { enoughVotingPowerToPropose } = useVotingPower()
    return (
        <div>
            <h3>Voting Power</h3>
            enough voting power to propose: {enoughVotingPowerToPropose?.toString()}
        </div>
    );
}

export default VotingPower;
