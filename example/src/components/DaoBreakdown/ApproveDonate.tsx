import React, { useState } from 'react';
import { useDonationMiner } from '@impact-market/utils';

const ApproveDonate = () => {
    const { approve, donateToTreasury } = useDonationMiner();
    const [approvedAmount, setApprovedAmount] = useState(0);
    const [donationIsLoading, setDonationIsLoading] = useState(false);
    const [donationAmount, setDonationAmount] = useState(false);

    const approveDonation = async () => {
        setDonationIsLoading(true);

        const response = await approve(donationAmount);

        setDonationIsLoading(false);

        if (response?.status) {
            setApprovedAmount(true);
        }
    }

    const executeDonation = async () => {
        setDonationIsLoading(true);

        const response = await donateToTreasury(donationAmount);

        setDonationIsLoading(false);

        if (response?.status) {
            setApprovedAmount(false);
        }
    }

    return (
        <>
            <h3>Approve & Donate</h3>
            <div style={{ marginTop: 8 }}>
                <input disabled={donationIsLoading} onChange={event => setDonationAmount(event.target.value)} type="number" value={donationAmount || ''} />
                <button disabled={donationIsLoading || approvedAmount} onClick={approveDonation}>Approve</button>
                <button disabled={donationIsLoading || !approvedAmount} onClick={executeDonation}>Donate</button>
                {donationIsLoading && <span> Loading...</span>}
            </div>
        </>
    )
}

export default ApproveDonate;
