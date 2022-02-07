import React from 'react';
import { hasPACTVotingPower } from '@impact-market/utils/pact';
import { ImpactMarketContext } from '../../context';

const VotingPower = () => {
    const { address, provider } = React.useContext(ImpactMarketContext);
    const enoughVotingPowerToPropose = hasPACTVotingPower(provider, address)
    return (
        <div>
            <h3>Voting Power</h3>
            enough voting power to propose: {enoughVotingPowerToPropose?.toString()}
        </div>
    );
}

export default VotingPower;
