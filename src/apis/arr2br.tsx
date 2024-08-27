const arr2br = (strs: string[]) =>
  strs.map((str, i) => (
    <>
      {i !== 0 && <br />}
      {str}
    </>
  ));

export default arr2br;
