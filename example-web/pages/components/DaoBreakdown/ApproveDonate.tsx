import React, { useState } from 'react';
import { useDonationMiner } from '@impact-market/utils/useDonationMiner';

const ApproveDonate = () => {
    const donationMiner = useDonationMiner();
    const [approvedAmount, setApprovedAmount] = useState(false);
    const [donationIsLoading, setDonationIsLoading] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');


    const approveDonation = async () => {
        setDonationIsLoading(true);

        const response = await donationMiner.approve(donationAmount);

        setDonationIsLoading(false);

        if (response?.status) {
            setApprovedAmount(true);
        }
    }

    const executeDonation = async () => {
        setDonationIsLoading(true);

        const response = await donationMiner.donateToTreasury(donationAmount);

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
