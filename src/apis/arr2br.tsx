const arr2br = (strs: string[]) =>
  strs.map((str, i) => (
    <span key={i}>
      {i !== 0 && <br />}
      {str}
    </span>
  ));

export default arr2br;
