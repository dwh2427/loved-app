import { Suspense } from "react";

export default function PrivatePageLayout({ children }) {
  <>
    <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
  </>;
}
