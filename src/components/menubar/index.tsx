import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { resetDeckStoreWithDatabase, type DeckStore, type DeckStoreActions } from "../../decks/context";
import type { Card } from "../../mtgjson/database";
import { readDeckyardFormat, writeDeckyardFormat } from "../../io/format";
import { fileLoadText, fileSave } from "../../io/filesystem";

export function MenuBar({database, deckStore, deckStoreActions}: {
    database: Record<string, Card>,
    deckStore: DeckStore,
    deckStoreActions: DeckStoreActions,
}) {
    return <Navbar className="p-0" expand="xl">
        <Nav>
            <NavDropdown className="p-0" title="File">
                <NavDropdown.Item 
                    onClick={() => {
                        deckStoreActions.reset(() => {
                            return resetDeckStoreWithDatabase(deckStore.decks.get("Database")!)
                        });
                    }}
                >New</NavDropdown.Item>
                <NavDropdown.Item 
                    onClick={async () => {
                        const contents = await fileLoadText([".dkyd"]);
                        if (!contents) return;
                        const data = readDeckyardFormat(database, contents);
                        data.decks.set("Database", deckStore.decks.get("Database")!);
                        deckStoreActions.reset(() => data);
                    }}
                >Import</NavDropdown.Item>
                <NavDropdown.Item 
                    onClick={async () => {
                        await fileSave("deck", "dkyd", new Blob([writeDeckyardFormat(deckStore)]));
                    }}
                >Export</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    </Navbar>;
}
