import React from 'react';
import { useEpoch } from '@impact-market/utils';

const Epoch = () => {
    const { epoch } = useEpoch();

    return (
        <>
            <h3>Epoch info</h3>
            <div style={{ marginTop: 8 }}>
                <div style={{ marginTop: 8 }}>
                    initialised {epoch?.initialised.toString()}
                </div>
                <div style={{ marginTop: 8 }}>
                    endPeriod {epoch?.endPeriod}
                </div>
                <div style={{ marginTop: 8 }}>
                    rewards {epoch?.rewards}
                </div>
                <div style={{ marginTop: 8 }}>
                    totalRaised {epoch?.totalRaised}
                </div>
                <div style={{ marginTop: 8 }}>
                    userContribution {epoch?.userContribution}
                </div>
                <h5>Donations (x days)</h5>
                <div style={{ marginTop: 8 }}>
                    {epoch?.donations.user}
                </div>
                <div style={{ marginTop: 8 }}>
                    {epoch?.donations.everyone}
                </div>
            </div>
        </>
    )
}

export default Epoch
