This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Endpoints

## One stat endpoints
Endpoints which don't show a development over the years, but a point in time stat

/election               - redirects to /elections

/election/{year}        - A election specific page for the year {year}
/election/{year}/{state}
/election/{year}/{state}/{constituency}

/election/{year}/{party}
/election/{year}/{state}/{party}
/election/{year}/{state}/{constituency}/{party}

### Grid lists
/elections                              - List of all elections with some basic stats to choose from (a grid list like below, just each implementation overrides the card & filters)
/election/{year}/states
/election/{year}/constituencies         - grouped grid list for each state with filters & search
/election/{year}/{state}/constituencies

/parties                - A grid list of all parties (a card for each party) which shows some basic stats like all the years they attended with a filter drp down at the tpop to search through the years
/states                 - Similar to party, a grid list of all possibilities with facts and filters
/constituencies         - Similar to party, a grid list of all possibilities with facts and filters


## Stat development endpoints
Endpoint which shows the development over the years, not just a result for a specific year

/party                  - redirects to /parties
/party/{name}           - A party specific site showing their development (entwicklung) over the years

/state                  - redirects to /states
/state/{name}           - a state specific site showing the development of key stats (eligible voters, turnout, secondary & first vote)

/constituency           - redirects to /constituencies
/constituency/{name}    - equal to state, but just for constituency (essentially same component)

/TODO some endpoint that show s the development for the whole election over the years, maybe just a slider at the top of a election to choose whether just {year} or up until now

## Talking components

- Grid list with cards and filters (Each implementation provides its own card design & filters) [GLC]
- development component, that takes in either a election, a state, a constituency
- development component for a party


### Example Nav Bar

Wahljahre
 - 2025
 - 2021
 - 2017
 - 2013
 - 2009
 - 2005

Bundesländer
 - NRW
 - Bayern
 - Hessen
 - SAchsen
 - Sachsen-Anhalt
 - Saarland
 - Hamburg
 - Berlin
 - Schleswig-Holstein
 - Baden Württemberg
 - Niedersachsen
 - Brandenburg
 - Rheinland Pfalz
 - Thüringen
 - Bremen
 - Meckpom

Wahlkreise


Ideen:

Wahl Entwicklung:
Graph entwicklung der Wahlbeteilligng

Partei einzel:
Bundesland & Wahlkreis mit höchster Zustimmung Absolut und prozentual gesehen auf Basis der wahl stimmen

Fakten System, das auf unterschiedliche max und min werte sucht auf Partei, Bundesland & Wahlkreis ebene und dann so dinge anzeigt wie (Wahlkreis mit den meisten stimmen für Partei x oder Bundesland mit den meisten Wahlbeteilligten im vergleich zu wahlberechtigten etc.)