import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import type { DeckStore, DeckStoreActions, EntryProperties } from "../../decks/context";
import { PromiseWrapped } from "../../util/promise";
import type { Card } from "../../mtgjson/database";
import dateFormat from "dateformat";

export function MenuBar({database, deckStore, deckStoreActions}: {
    database: Record<string, Card>,
    deckStore: DeckStore,
    deckStoreActions: DeckStoreActions,
}) {
    return <Navbar className="p-0" expand="xl">
        <Nav>
            <NavDropdown className="p-0" title="File">
              <NavDropdown.Item onClick={() => {
                deckStoreActions.deckModify("Mainboard",     d => d.cards.clear());
                deckStoreActions.deckModify("Sideboard",     d => d.cards.clear());
                deckStoreActions.deckModify("Considerboard", d => d.cards.clear());
              }}>New</NavDropdown.Item>
              <NavDropdown.Item onClick={async () => {

                const dialog = document.createElement("input");
                dialog.type = "file";
                dialog.accept = ".dkyd";

                const p = new PromiseWrapped<string | null>();
                dialog.oncancel = () => p.resolve(null);
                dialog.onchange = async () => p.resolve(await (dialog.files?.item(0)?.text()) ?? null);
                dialog.click();

                const contents = await p;
                if (!contents) return;

                const data = JSON.parse(contents);

                const mainboard     = parseDeck(database, data["Mainboard"] as [string, Record<string, any>][]);
                const sideboard     = parseDeck(database, data["Sideboard"] as [string, Record<string, any>][]);
                const considerboard = parseDeck(database, data["Considerboard"] as [string, Record<string, any>][]);

                deckStoreActions.deckModify("Mainboard",     d => d.cards = new Map(mainboard));
                deckStoreActions.deckModify("Sideboard",     d => d.cards = new Map(sideboard));
                deckStoreActions.deckModify("Considerboard", d => d.cards = new Map(considerboard));
                
              }}>Import</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {

                const data = {
                    "Mainboard":     writeDeck(deckStore.decks.get("Mainboard")?.cards ?? []),
                    "Sideboard":     writeDeck(deckStore.decks.get("Sideboard")?.cards ?? []),
                    "Considerboard": writeDeck(deckStore.decks.get("Considerboard")?.cards ?? []),
                };

                const contents = JSON.stringify(data);
                const url = URL.createObjectURL(new Blob([contents]));

                const link = document.createElement("a");
                link.href = url;
                link.download = `deck-${dateFormat(new Date(), "yyyy-mm-dd_hh-MM-ss_l")}.dkyd`;
                link.click();
              }}>Export</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    </Navbar>;
}

function writeDeck(cards: Iterable<[Card, EntryProperties]>): [string, Record<string, any>][] {
    const result: [string, Record<string, any>][] = [];
    for(const [card, props] of cards) {
        result.push([card.uid, props])
    }
    return result;
}

function parseDeck(database: Record<string, Card>, deck: [string, Record<string, any>][]) {
    const result: [Card, EntryProperties][] = [];
    for(const [uid, props] of deck) {
        const card = database[uid];
        if (!card) {
            console.error("Could not find card with UID: " + card);
            continue;
        }
        result.push([card, props as EntryProperties]);
    }
    return result;
}