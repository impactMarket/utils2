import React, { useState } from 'react';
import { useDonationMiner } from '@impact-market/utils/useDonationMiner';

const ApproveDonate = () => {
    const donationMiner = useDonationMiner();
    const [approvedAmount, setApprovedAmount] = useState(false);
    const [donationIsLoading, setDonationIsLoading] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [communityAddress, setCommunityAddress] = useState('');

    const approveDonation = async () => {
        setDonationIsLoading(true);

        let response;
        if (communityAddress.length > 0) {
            response = await donationMiner.approve(donationAmount, communityAddress);
        } else {
            response = await donationMiner.approve(donationAmount);
        }

        setDonationIsLoading(false);

        if (response?.status) {
            setApprovedAmount(true);
        }
    };

    const executeDonation = async () => {
        setDonationIsLoading(true);

        let response;
        if (communityAddress.length > 0) {
            response = await donationMiner.donateToCommunity(communityAddress, donationAmount);
        } else {
            response = await donationMiner.donateToTreasury(donationAmount);
        }

        setDonationIsLoading(false);

        if (response?.status) {
            setApprovedAmount(false);
        }
    };

    return (
        <>
            <h3>Approve & Donate</h3>
            <div style={{ marginTop: 8 }}>
                <input
                    placeholder="amount"
                    disabled={donationIsLoading}
                    onChange={event => setDonationAmount(event.target.value)}
                    type="number"
                    value={donationAmount || ''}
                />
                <br />
                <input
                    placeholder="community address (optional)"
                    disabled={donationIsLoading}
                    onChange={event => setCommunityAddress(event.target.value)}
                    value={communityAddress || ''}
                    style={{ width: 400 }}
                />
                <br />
                <button disabled={donationIsLoading || approvedAmount} onClick={approveDonation}>
                    Approve
                </button>
                <br />
                <button disabled={donationIsLoading || !approvedAmount} onClick={executeDonation}>
                    Donate
                </button>
                <br />
                {donationIsLoading && <span> Loading...</span>}
            </div>
        </>
    );
};

export default ApproveDonate;
