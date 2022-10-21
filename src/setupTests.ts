// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect';
import { toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);
