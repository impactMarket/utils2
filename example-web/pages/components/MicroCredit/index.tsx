import WalletConnection from '../WalletConnection';
import LoanManager from './LoanManager';
import Borrower from './Borrower';

const MicroCredit = () => {
    return (
        <WalletConnection title="MicroCredit">
            <LoanManager />
            <Borrower />
        </WalletConnection>
    );
};

export default MicroCredit;
