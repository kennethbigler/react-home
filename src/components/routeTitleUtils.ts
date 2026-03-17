export const BASE_TITLE = "Ken Bigler's Website";

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
};

/** Map path segments to page titles for WCAG 2.4.2 (Page Titled) */
export const getPageTitle = (pathname: string): string => {
  const segment = pathname.replace(/^#\/?/, "").split("/").filter(Boolean)[0];
  const sub = pathname.replace(/^#\/?/, "").split("/").filter(Boolean)[1];
  let page: string;
  if (!segment) {
    page = BASE_TITLE;
  } else if (segment === "games") {
    page = sub ? `${toTitleCase(sub.replace(/-/g, " "))} | Game` : "Games";
  } else {
    page = toTitleCase(segment.replace(/-/g, " "));
  }
  return page === BASE_TITLE ? BASE_TITLE : `${page} | ${BASE_TITLE}`;
};
