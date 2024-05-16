'use client';
// import { UserAccount } from '@neosync/sdk';
import { useParams, useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { useGetUserAccounts } from '@/lib/hooks/useUserAccounts';
import { signOut } from 'next-auth/react';

interface AccountContextType {
    account: UserAccount | undefined;
    setAccount(updatedAccount: object): void;
    isLoading: boolean;
    mutateUserAccount(): void;
}
const AccountContext = createContext<AccountContextType>({
    account: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAccount: () => { },
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mutateUserAccount() { },
});

interface Props {
    children: ReactNode;
    session: Session | null;
}

interface UserAccount {
    id: number,
    name: string
    email: string,
    neosync_account_id: string
    access_token: string | undefined
}

export default function AccountProvider(props: Props): ReactElement {
    const { children, session } = props;
    const accessToken = session?.user?.accessToken;
    const refreshToken = session?.user?.refreshToken;
    const { accountId } = useParams();

    const { data: accountResponse, error, isLoading, mutate } = useGetUserAccounts(accessToken);
    const router = useRouter();

    const [userAccount, setUserAccount] = useState<UserAccount | undefined>(
        undefined
    );

    useEffect(() => {
        if (error) {
            signOut({ redirect: false });
            router.push('/login');
        }
        if (isLoading) {
            return;
        }
        if (!accountResponse) {
            return;
        }

        if (accountId === accountResponse?.neosync_account_id) {
            return;
        }
        // if (userAccount && foundAccount && userAccount.id === foundAccount.id) {
        //     return;
        // }
        setUserAccount({
            id: accountResponse.id,
            name: accountResponse.name,
            email: accountResponse.email,
            neosync_account_id: accountResponse.neosync_account_id,
            access_token: accessToken,
        });

        router.push(`/dashboard/${accountResponse?.neosync_account_id}/jobs`);

    }, [isLoading, accountId, accountResponse, router, accessToken]);

    function setAccount(userAccount: UserAccount): void {
        if (userAccount.neosync_account_id !== accountId) {
            // this order matters. Otherwise if we push first,
            // when it routes to the page, there is no account param and it defaults to personal /shrug
            // by setting this here, it finds the last selected account and is able to effectively route to the correct spot.
            setUserAccount(userAccount);
            router.push(`/dashboard/${userAccount.neosync_account_id}`);
        }
    }

    return (
        <AccountContext.Provider
            value={{
                account: userAccount,
                setAccount: setAccount,
                isLoading,
                mutateUserAccount: mutate,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}


export function useAccount(): AccountContextType {
    const account = useContext(AccountContext);
    return account;
}
