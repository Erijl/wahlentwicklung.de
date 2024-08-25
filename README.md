# [Wahlentwicklung.de](https://wahlentwicklung.de)
(engl. Election development) is a website that visualizes the development of the German elections 
(the "Bundestagswahlen") over the years.
It's a small project I started to to get the gist of Angular & Spring Boot, so it's no where near utilizing the full potential of the data set.


The website itself is built with Angular, the backend using Spring Boot, and the data is stored in a PostgreSQL database.
To be more specific, [Supabase](https://supabase.com/).

# Current state
As mentioned above, the website is nowhere near its full potential, 
and is currently down due to poor infrastructure choices on my part.

I will revisite the project in preparation for the upcoming election in 2025 later this year, to also make sure the whole dataset is fully utilized.

## Project Structure
The project is divided into four parts:

    .
    ├── wahlentwicklung-backend             # Spring Boot backend
    ├── wahlentwicklung-database            # PGSQL database scripts used
    ├── wahlentwicklung-frontend            # Angular frontend
    ├── wahlentwicklung-import-script       # Python script to import data
    └── ...                                 # etc.

## TODO
Some ToDo items that, if I get back to this, definitely need to be done.

- [ ] Rework everthing...

## Dictionary
Since it's about the German elections, and the .csv files with the data are in german,
I thought, I add a small dictionary so you might be able to understand the database structure a little better.

| English  | German     |
|----------|------------|
| election | Wahl       |
| party    | Partei     |
| district | Wahlkreis  |
| state    | Bundesland |

## Contributors

> <img src="https://avatars.githubusercontent.com/erijl"   height="50px" title="Erijl"/> | [`@erijl`](https://github.com/erijl)

## License
This repository is licensed under [MIT](https://github.com/Erijl/wahlentwicklung.de/blob/master/LICENSE) Copyright (c) 2023 - 2024 Wahlentwicklung
