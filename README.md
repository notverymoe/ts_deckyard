# Deckyard

Deckyard is a simple deck building application that leverages an offline
card database, allowing for simple local deployments without access to 
persistent web services.

The interface attempts to provide a single unified view for card discovery and deck building, displaying only the information of selected cards and otherwise providing a compact representation of deck lists. In comparison to other offerings, where searching for a card usually involves wading through a sea of fullsize card images displayed in an infinite grid without being able to view or compare to cards currently in your deck without a second window or tab.

This deck building app is not meant to replace those other services, merely offering a complimentry interface with a different approach that also functions offline. In the future, where possible, integration with these services is desired.

## Usage

Proper packing for this application does not currently exist.

To simply run the application, you can install npm and python and run the following commands:
```
npm install
npm run pyhost
```

This will build the project and host the files using python's in-built http-server. You should be able to access the app by navigating your browser to http://localhost:8080/

Alternatively, run:
```
npm install
npm run build
```

To just build the website to the `dist/` directory for you to manually host.

## Development

This project is developed using vite. Simply run `npm run dev`, after setting up
the project with `npm install`, to have vite build, host and hotreleoad the application.

We're making use of typescript, immer, preact, preact singals, flexsearch and bootstrap in this application.

## License

This project is provided to you under the AGPLv3 License, see
[LICENSE.md](LICENSE.md) for the full text of this license.

## Third-Party

### MTGJson
This project is not affiliated or endorsed by the
mtgjson project. 

Some parts of this project - the card database and typing for the
card database - are taken from the mtgjson project and used under
the license they are provided under. Those resources are marked and
are availiable under the same license the mtgsion project provides
them under. For the majority of components, this is the MIT license,
but each item is individually marked.

More information about this project can be found here:
- https://mtgjson.com/

### WotC
Deckyard is unofficial Fan Content permitted under the Fan Content Policy. Not
approved/endorsed by Wizards. Portions of the materials used are property of
Wizards of the Coast. ©Wizards of the Coast LLC.
- https://company.wizards.com/en/legal/fancontentpolicy


