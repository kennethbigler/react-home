const arr2br = (strings?: string[]) =>
  strings?.map((str, i) => (
    <span key={i}>
      {i !== 0 && <br />}
      {str}
    </span>
  ));

export default arr2br;
