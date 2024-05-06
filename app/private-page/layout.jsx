import { Suspense } from "react";

export default function PrivatePageLayout({ children }) {
  return <Suspense fallback={<div>loading...</div>}>{children}</Suspense>;
}
