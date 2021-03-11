# Home

![CI](https://github.com/kennethbigler/react-home/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/kennethbigler/react-home/branch/main/graph/badge.svg?token=MEHKW2MF4N)](https://codecov.io/gh/kennethbigler/react-home)
[![Code Quality Score](https://www.code-inspector.com/project/20052/score/svg)](https://frontend.code-inspector.com/public/project/20052/react-home/dashboard)
[![Code Grade](https://www.code-inspector.com/project/20052/status/svg)](https://frontend.code-inspector.com/public/project/20052/react-home/dashboard)
![License](https://img.shields.io/github/license/kennethbigler/react-home)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kennethbigler/react-home/graphs/commit-activity)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://kennethbigler.com)

This is a website created by me to represent my resume. I use ReactJS and it is hosted by GitHub Pages.

View the site at [kennethbigler.com](http://www.kennethbigler.com/)

## Setup

For development you need to be on Node >= v6.

To run this code locally:

```bash
npm install
npm run start
```

## Supported Browsers

| IE  | Edge  | Firefox | Chrome | Safari |
| :-: | :---: | :-----: | :----: | :----: |
| 11  | >= 14 |  >= 45  | >= 49  | >= 10  |

## Add this back to package.json after tests are complete

```json
  "jest": {
    "collectCoverageFrom": ["src/**/*.{ts,tsx}"],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    },
    "coverageReporters": ["text"]
  }
```
