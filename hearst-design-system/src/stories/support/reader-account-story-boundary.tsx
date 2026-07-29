import React from "react";

import {
  ReaderAccountProvider,
  type ReaderAccount,
} from "@/components/reader-account";

const accountStorageKey = "hearst-reader-account-v1";
const sessionStorageKey = "hearst-reader-session-v1";

export type StoredAccountFixture = ReaderAccount & { passwordHash: string };

export function ReaderAccountStoryBoundary({
  account,
  children,
}: {
  account?: StoredAccountFixture;
  children: React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    let active = true;
    if (account) {
      window.localStorage.setItem(accountStorageKey, JSON.stringify(account));
      window.localStorage.setItem(sessionStorageKey, account.id);
    } else {
      window.localStorage.removeItem(accountStorageKey);
      window.localStorage.removeItem(sessionStorageKey);
    }
    window.queueMicrotask(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
      window.localStorage.removeItem(accountStorageKey);
      window.localStorage.removeItem(sessionStorageKey);
    };
  }, [account]);

  return ready ? <ReaderAccountProvider>{children}</ReaderAccountProvider> : null;
}
