import React, { useState } from 'react';
import { useDonationMiner } from '@impact-market/utils';

const ApproveDonate = () => {
    const { approve, donateToTreasury, donateToCommunity } = useDonationMiner();
    const [approvedAmount, setApprovedAmount] = useState(false);
    const [donationIsLoading, setDonationIsLoading] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [approvedAmountToCommunity, setApprovedAmountToCommunity] = useState(false);
    const [donationIsLoadingToCommunity, setDonationIsLoadingToCommunity] = useState(false);
    const [donationAmountToCommunity, setDonationAmountToCommunity] = useState('');

    // only alfajores
    const demoCommunity = '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab';

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

    const approveDonationToCommunity = async () => {
        setDonationIsLoadingToCommunity(true);

        const response = await approve(donationAmountToCommunity, demoCommunity);

        setDonationIsLoadingToCommunity(false);

        if (response?.status) {
            setApprovedAmountToCommunity(true);
        }
    }

    const executeDonationToCommunity = async () => {
        setDonationIsLoadingToCommunity(true);

        const response = await donateToCommunity(demoCommunity, donationAmountToCommunity);

        setDonationIsLoadingToCommunity(false);

        if (response?.status) {
            setApprovedAmountToCommunity(false);
        }
    }

    return (
        <>
            <h3>Approve & Donate (Treasury)</h3>
            <div style={{ marginTop: 8 }}>
                <input disabled={donationIsLoading} onChange={event => setDonationAmount(event.target.value)} type="number" value={donationAmount || ''} />
                <button disabled={donationIsLoading || approvedAmount} onClick={approveDonation}>Approve</button>
                <button disabled={donationIsLoading || !approvedAmount} onClick={executeDonation}>Donate</button>
                {donationIsLoading && <span> Loading...</span>}
            </div>
            <h3>Approve & Donate (Community)</h3>
            <div style={{ marginTop: 8 }}>
                <input disabled={donationIsLoadingToCommunity} onChange={event => setDonationAmountToCommunity(event.target.value)} type="number" value={donationAmountToCommunity || ''} />
                <button disabled={donationIsLoadingToCommunity || approvedAmountToCommunity} onClick={approveDonationToCommunity}>Approve</button>
                <button disabled={donationIsLoadingToCommunity || !approvedAmountToCommunity} onClick={executeDonationToCommunity}>Donate</button>
                {donationIsLoadingToCommunity && <span> Loading...</span>}
            </div>
        </>
    )
}

export default ApproveDonate;
