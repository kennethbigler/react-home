# Home

<!-- [![codecov](https://codecov.io/gh/kennethbigler/react-home/branch/main/graph/badge.svg)](https://codecov.io/gh/kennethbigler/react-home/) -->
![CI](https://github.com/kennethbigler/react-home/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/kennethbigler/react-home/branch/main/graph/badge.svg?token=MEHKW2MF4N)](https://codecov.io/gh/kennethbigler/react-home)
![License](https://img.shields.io/github/license/kennethbigler/react-home)

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
