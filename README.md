## Demo
[https://robot-factory.azurewebsites.net/](https://robot-factory.azurewebsites.net/)

## Prerequisites
- Node.js v8.0+

## Quick Start
```sh
npm install
npm run dev
```

## Run test
```sh
npm test
```

## Tech stack used for this app
- React
- Redux
- React-Router
- Styled Components
- Jest
- Enzyme

## Important modules
- [/src/store/QualityAssurance.js](/src/store/QualityAssurance.js)
  : This redux store module implements the logic for returning robots for each pages, recycling robots, sening shipment and completing QA in its actionCreator object and reducer function
- [/src/components/shared/RobotList.js](/src/components/shared/RobotList.js)
  : This component renders robots for each pages by filtering statusToFilter prop which passed from container components e.g. [/src/components/ReadyForQA/Index.js](/src/components/ReadyForQA/Index.js), [/src/components/ReadyToShip/Index.js](/src/components/ReadyToShip/Index.js)...
