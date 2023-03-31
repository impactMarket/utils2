import WalletConnection from '../WalletConnection';
import UserLoans from './UserLoans';

const MicroCredit = () => {
    return (
        <div>
            {'MicroCredit'}
            <WalletConnection title="MicroCredit">
                <UserLoans />
            </WalletConnection>
        </div>
    );
};

export default MicroCredit;
