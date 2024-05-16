'use client';
// import { UserAccount } from '@neosync/sdk';
import { useParams, useRouter } from 'next/navigation';
import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { useGetUserAccounts } from '@/lib/hooks/useUserAccounts';
import { Session } from 'next-auth';

interface AccountContextType {
    account: object | undefined;
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
    
}

export default function AccountProvider(props: Props): ReactElement {
    const { children, session } = props;
    const accessToken = session?.user?.accessToken;
    const { accountId } = useParams();

    const { data: accountResponse, isLoading, mutate } = useGetUserAccounts(accessToken);
    const router = useRouter();

    const [userAccount, setUserAccount] = useState(
        undefined
    );

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (accountId === accountResponse?.neosync_account_id) {
            return;
        }
        // if (userAccount && foundAccount && userAccount.id === foundAccount.id) {
        //     return;
        // }
        setUserAccount(accountResponse);

        router.push(`/dashboard/${accountResponse?.neosync_account_id}/jobs`);

    }, [
        userAccount?.id,
        userAccount?.name,
        accountsResponse?.accounts.length,
        isLoading,
        accountName,
    ]);

    function setAccount(userAccount: UserAccount): void {
        if (userAccount.name !== accountName) {
            // this order matters. Otherwise if we push first,
            // when it routes to the page, there is no account param and it defaults to personal /shrug
            // by setting this here, it finds the last selected account and is able to effectively route to the correct spot.
            setLastSelectedAccount(userAccount.name);
            setUserAccount(userAccount);
            router.push(`/${userAccount.name}`);
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

function useGetAccountName(): string {
    const { account } = useParams();

    const accountParam = getSingleOrUndefined(account);
    if (accountParam) {
        return accountParam;
    }
    const singleStoredAccount = getSingleOrUndefined(storedAccount);
    if (singleStoredAccount) {
        return singleStoredAccount;
    }
    return DEFAULT_ACCOUNT_NAME;
}

function getSingleOrUndefined(val: string | string[]): string | undefined {
    if (Array.isArray(val)) {
        return val.length > 0 ? val[0] : undefined;
    }
    return val;
}

export function useAccount(): AccountContextType {
    const account = useContext(AccountContext);
    return account;
}
