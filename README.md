# swpp2020-team10

[![Build Status](https://travis-ci.org/swsnu/swpp2020-team10.svg?branch=master)](https://travis-ci.org/swsnu/swpp2020-team10)  

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team10&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team10)

[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team10/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2020-team10?branch=master)  

# Running the app
1. Clone this repository.  
2. Run frontend with
  - `cd frontend`
  - `yarn install`
  - `yarn start`
3. From another terminal, run backend with
  - `cd backend`
  - `pip install -r requirements.txt`
  - `python3 manage.py migrate`
  - `python3 manage.py runserver`
  
# Testing
On frontend, backend directory, respectively, run


`yarn test --coverage --watchAll=false --passWithNoTests`  
`coverage run --source='.' manage.py test --keepdb`  
