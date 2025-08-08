# WahlentwicklungUi



## Structured plan

### One stat endpoints
Endpoints which don't show a development over the years, but a point in time stat for the given election

- `/election/{year}`
- `/election/{year}/{state}`
- `/election/{year}/{state}/{constituency}`
- `/election/{year}/{party}`
- `/election/{year}/{state}/{party}`
- `/election/{year}/{state}/{constituency}/{party}`

### Grid lists
Overview pages which allow the user to select which then redirects o either a one stat endpoint or a stat development endpoint.
A list / grid kinda thing with possibly cards and a search bar as well as some filters

- `/elections`
- `/election/{year}/states`
- `/election/{year}/constituencies`
- `/election/{year}/{state}/constituencies`
- `/parties`
- `/states`
- `/constituencies`

### Stat development endpoints
Endpoint which shows the development over the years, not just a result for a specific year

- `/party/{name}` - A party specific site showing their development over the years
- `/state/{name}` - a state specific site showing the development of key stats
- `/constituency/{name}` - equal to state, but just for constituency

### redirects
- `/constituency` - redirects to `/constituencies`
- `/state` - redirects to `/states`
- `/party` - redirects to `/parties`
- `/election` - redirects to `/elections`
