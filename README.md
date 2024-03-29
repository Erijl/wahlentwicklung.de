# [Wahlentwicklung.de](https://wahlentwicklung.de)
(engl. Election development) is a website that visualizes the development of the German elections 
(the "Bundestagswahlen") over the years.
It's a project that I started to learn more about web development in angular (but definitely not designing).
The website is built with Angular, the backend using Spring Boot, and the data is stored in a PostgreSQL database.
To be more specific, [Supabase](https://supabase.com/).

## Side Note / Contributing
If you see the live site (yes it's actually live, [wahlentwicklung.de](https://wahlenwticklung.de) you might say,
that's just two statistics, isn't there more data?
And yes, you're right, the website is just a tiny fraction of what it could've been.
The thing is, I really enjoy backend development and everything that goes with it, but oh boy, you can hunt me
with frontend design. Not development, that isn't a problem (I hope), but designing something from the ground up
looking good, having a solid UI/UX, getting everything in there without it being messy, yeah... no chance.
And yes, if you know tailwindcss some/most components will be familiar since this is exactly it,
copy-pasted components adjusted to fit the style, but nothing that can scale.

In other words, if you like the idea, and you are for whatever reason passionate about it, 
feel free to contribute or just take this as inspiration.
And if you were to actually contribute and have ideas for statistics,
open a new issue, and I am more than happy to add/implement whatever endpoint you can imagine.

But for now, I'll move on, and let this be another 'unfinished' opensource project (still maintained though).

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