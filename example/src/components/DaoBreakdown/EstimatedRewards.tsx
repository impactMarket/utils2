import React, { useState } from 'react';
import { useRewards } from '@impact-market/utils';

const Updater = () => {
    const { rewards } = useRewards();
    const [, setUpdate] = useState(new Date().getMilliseconds());

    console.log(rewards)

    return (
        <button onClick={() => setUpdate(new Date().getMilliseconds())}>refresh the thing</button>
    )
}

const EstimatedRewards = () => {
    const { rewards } = useRewards();
    const [isOn, setIsOn] = useState(false);

    return (
        <>
            <h3>Estimated Rewards</h3>
            <div style={{ marginTop: 8 }}>
                {rewards?.estimated}
            </div>
            <button onClick={() => setIsOn(!isOn)}>toggle refresher for mounting test</button>
            {isOn && <Updater />}
        </>
    )
}

export default EstimatedRewards;
