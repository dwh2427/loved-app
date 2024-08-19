import dynamic from "next/dynamic";

const LovedBoxHeader = dynamic(
  () => import("@/components/loved-box/lovedBoxHeader"),
  {
    ssr: false,
  }
);

export default LovedBoxHeader;