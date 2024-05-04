// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return (error) => {
    const errorRes = error?.response?.data;
    if (errorRes) {
      alert.error(errorRes.error);
    } else alert.error(error.message);
  };
}
