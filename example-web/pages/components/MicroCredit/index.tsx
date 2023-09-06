import WalletConnection from '../WalletConnection';
import LoanManager from './LoanManager';
import UserLoans from './UserLoans';

const MicroCredit = () => {
    return (
        <div>
            {'MicroCredit'}
            <WalletConnection title="MicroCredit">
                <UserLoans />
                <LoanManager />
            </WalletConnection>
        </div>
    );
};

export default MicroCredit;
