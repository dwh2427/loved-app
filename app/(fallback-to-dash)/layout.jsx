import Session from "./session";

export default function FallbackToLoginLayout({ children }) {
  return (
    <>
      <Session>{children}</Session>
    </>
  );
}
