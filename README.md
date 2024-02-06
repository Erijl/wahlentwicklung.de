# Wahlentwicklung.de


## TODO

- [x] Refactor & reorganize Frontend
- [x] Rework Database
  - [x] English names
  - [ ] configure rls policies
- [x] Move Backend to Spring boot
  - [ ] Use Anon key
  - [x] Refactor Array use
  - [ ] Add cache manager to speed up queries
- [ ] Rework Frontend
    - [ ] fix data service
    - [ ] Add production & development mode
    - [ ] Rework year selection
    - [ ] Split data service up
    - [ ] Rework font sizes (especially in the charts)
- [ ] Add more content

## Dictionary
Since it's about the German elections, I thought, I add a dictionary just to make sure everybody is on the same page.

| English  | German     |
|----------|------------|
| election | Wahl       |
| party    | Partei     |
| district | Wahlkreis  |
| state    | Bundesland |

### Note
Run
``chmod -v 600 acme.json``
in root directory of server.