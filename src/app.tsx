// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./app.css";

import { useMemo, useState } from 'preact/hooks';

import { resetDeckStoreWithDatabase, useNewDeckStore, type DeckStore, type EntryProperties } from './decks/context';
import { getTextSizes } from './util/size';
import { useElementWidth } from './preact/use_size';
import type { Card } from "./mtgjson/database";
import { DeckViewMemoized } from "./components/deck_view";
import { useNewDeckViewStore } from "./components/deck_view/store";

import { SearchIndexProvider, useNewSearchIndex } from "./search";
import { DatabaseEnumInfoProvider, useNewDatabaseEnumInfo } from "./dbenum";
import { MenuBar } from "./components/menubar";


export function App({db}: {db: Record<string, Card>}) {
    // Enums // 
    const dbEnumInfo = useNewDatabaseEnumInfo(() => Object.values(db));

    // Search //
    const searchIndex = useNewSearchIndex(() => Object.values(db));

    // Decks //
    const [deckStore, deckStoreActions] = useNewDeckStore((): DeckStore => {
        return resetDeckStoreWithDatabase({ 
            cards: new Map(Object.values(db).map((v): [Card, EntryProperties] => [v, { qty: null, tags: [] }])) 
        });
    });    
    const deckIds = useMemo(() => Array.from(deckStore.decks.keys()), []); 
    
    // Views //
    const [deckViews, deckViewActions] = useNewDeckViewStore(() => ({
        activeView: 0,
        views: deckIds.map(deck => ({
            selectedCard: null,
            selectedDeck: deck, 
            viewFilter: null
        }))
    }));
    
    // Column Display Management //
    const columnWidth = useMemo(() => 40*getTextSizes(document.body)[0], []);
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const screenWidth = useElementWidth(rootRef, 640);
    const columns = calcColumns(screenWidth, columnWidth, 2, deckIds.length);

    // Application Root //
    return <DatabaseEnumInfoProvider enumInfo={dbEnumInfo}>
        <SearchIndexProvider searchIndex={searchIndex}>
            <div className="app-toolbar">
                <MenuBar
                    database={db}
                    deckStore={deckStore}
                    deckStoreActions={deckStoreActions}
                />
            </div>
            <div 
                className="app-content"
                ref={setRootRef} 
                style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}
            >
                {Array.from({length: columns}, (_, index) => <DeckViewMemoized 
                    key={index}
                    index={index}
                    deckViews={deckViews}
                    deckViewActions={deckViewActions}
                    deckStore={deckStore}
                    deckStoreActions={deckStoreActions}
                />)}
            </div>
        </SearchIndexProvider>
    </DatabaseEnumInfoProvider>;
}

function calcColumns(
    screenWidth: number | null, 
    columnWidth: number, 
    minColumns: number, 
    maxColumns: number
) {
    if (screenWidth === null) return minColumns;
    const columns = Math.floor(screenWidth/columnWidth);
    return Math.max(minColumns, Math.min(maxColumns, columns));
}