# [Wahlentwicklung.de](https://wahlentwicklung.de)
(engl. Election development) is a website that visualizes the development of the German elections 
(the "Bundestagswahlen") over the years.

The website itself is built with Angular, the backend using Spring Boot, and the data is stored in a PostgreSQL database.
To be more specific, [Supabase](https://supabase.com/).

# Maintenance
The project will be put into maintenance starting December 2024, for me to revisit the project in preparation for the
election that is coming up in February 2025. There's a lot to come, so stay tuned!

## Contributing
The project is still maintained, and I will continue to push security updates and keep the website running.

If you want to contribute, feel free to open an issue/pull request and I'll take a look!

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

- [ ] Add cache manager to speed up queries
- [ ] Rework Frontend
- [ ] Add more content
- [ ] streamline publishing process

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
