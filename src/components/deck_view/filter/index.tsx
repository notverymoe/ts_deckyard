// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./filter.css";

import { useCallback, useEffect, useLayoutEffect, useState } from "preact/hooks";
import { Button, Collapse, Form, InputGroup, Modal } from "react-bootstrap";
import { useImmer, type Updater } from "use-immer";

import { joinClassNames      } from "../../../preact/class_names";
import { useDatabaseEnumInfo } from "../../../dbenum";
import { useSearchIndex      } from "../../../search";

import { SymbolSingle              } from "../../symbols";

import { type DeckViewStoreActions } from "../store";

import { doMultiSearch, doSearch, findLegalityIn, findSymbolAllIn, findSymbolAnyIn, findSymbolNoneIn, newFilterAdvanced, newFilterEmpty, type FilterParams } from "./util";

import IconSearch from "/icons/material/search.svg";
import IconArrow from "/icons/material/arrow_forward.svg";
import IconClose from "/icons/material/close.svg";

export function FilterOptions({index, deckViewActions}: {
    index: number,
    deckViewActions: DeckViewStoreActions,
}) {
    const searchIndex = useSearchIndex();
    const [filterOptions, setFilterOptions] = useImmer<FilterParams>(newFilterEmpty());
    useEffect(
        () => {
            switch(filterOptions.mode) {
                case "off":      deckViewActions.setViewFilter(index, null); return;
                case "simple":   applySimpleSearch(index, deckViewActions, searchIndex, filterOptions.simple); return;
                case "advanced": applyAdvancedSearch(index, deckViewActions, searchIndex, filterOptions.advanced); return;
            }
        }, 
        [searchIndex, filterOptions]
    );
    
    const [showModal, setShowModal] = useState(false);
    const handleShow  = useCallback(() => setShowModal(true ), []);
    const handleCloseCancel = useCallback(() => setShowModal(false), []);
    const handleCloseApply  = useCallback((params: FilterParams) => {
        setFilterOptions(() => params);
        setShowModal(false);
    }, []);

    return <>
        <FilterToolbar
            setFilterOptions={setFilterOptions}
            handleShowModal={handleShow}
            filterOptions={filterOptions}
        />
        <FilterModal
            show={showModal}
            currentFilter={filterOptions}
            close={handleCloseCancel}
            apply={handleCloseApply}
        />
    </>;
}

function FilterToolbar({handleShowModal, filterOptions, setFilterOptions}: {
    handleShowModal: () => void,
    filterOptions: FilterParams,
    setFilterOptions: Updater<FilterParams>,
}) {
    return <div className="toolbar-filter">
        <InputGroup>
            <Button className="p-2" title="Set advanced filter" onClick={handleShowModal} variant="secondary">
                <img src={IconSearch}/>
            </Button>
            <Form.Control
                type="text"
                title={(filterOptions.mode === "advanced") 
                    ? "Clear filters to perform simple filter" 
                    : "Enter simple search term"
                }
                disabled={filterOptions.mode === "advanced"}
                value={filterOptions.simple}
                onChange={ev => {
                    const term = ev.currentTarget.value;
                    setTimeout(() => setFilterOptions(options => {
                        options.simple = term;
                        options.mode = term.length ? "simple" : "off";
                    }));
                }}
            />
            <Button 
                className="p-2" 
                title={filterOptions.mode === "off" ? "No filter set" : "Clear filter"}
                onClick={() => setFilterOptions(newFilterEmpty)}
                disabled={filterOptions.mode === "off"}
                variant="danger"
            >
                <img src={IconClose}/>
            </Button>
        </InputGroup>
    </div>;
}



function FilterModal({show, close, currentFilter, apply}: {
    show: boolean,
    close: () => void,
    currentFilter: FilterParams,
    apply: (params: FilterParams) => void,
}) {
    const [state, setState] = useImmer(currentFilter.advanced);
    useLayoutEffect(() => {
        if (!show) return;                // Reset state on open
        setState(currentFilter.advanced); // TODO we should make the state vanish on close
    }, [show]);

    return <Modal show={show} onHide={close} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Set Advanced Filter Options</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form className="filter-form">
                <FilterSearchTerm name="Name"   subtitle="Filter based on the text in the card's name"      field="name" state={state} setState={setState}/>
                <FilterSearchTerm name="Type"   subtitle="Filter based on the text in the card's type"      field="type" state={state} setState={setState}/>
                <FilterSearchTerm name="Text"   subtitle="Filter based on the text in the card's rule text" field="text" state={state} setState={setState}/>
                <FilterSearchTerm name="Errata" subtitle="Filter based on the text in the card's errata"    field="text" state={state} setState={setState}/>

                <FilterLegalityGroup name="Legalities" keyName="legalities" setState={setState} state={state}/>

                <FilterCostGroup name="Cost Includes (Any)" keyName="costAny"  setState={setState} state={state}/>
                <FilterCostGroup name="Cost Includes (All)" keyName="costAll"  setState={setState} state={state}/>
                <FilterCostGroup name="Cost Excludes (All)" keyName="costNone" setState={setState} state={state}/>
            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button variant="danger"    onClick={() => apply(newFilterEmpty())} disabled={currentFilter.mode === "off"}>Reset</Button>
            <Button variant="primary"   onClick={() => apply(newFilterAdvanced(state))}>Filter</Button>
        </Modal.Footer>
    </Modal>
}

function FilterSearchTerm<K extends KeysMatching<FilterParams["advanced"], string>>({state, setState, field, name, subtitle}: {
    state: Record<K, string>,
    setState: Updater<FilterParams["advanced"]>,
    field: K,
    name: string,
    subtitle?: string,
}) {
    return  <Form.Group className="mb-3">
        <Form.Label>{name}</Form.Label>
        <Form.Control 
            type="text"
            value={state[field]} 
            onChange={ev => setState(state => { state[field] = ev.currentTarget.value; })}
        />
        {subtitle && <Form.Text className="text-muted">{subtitle}</Form.Text>}
    </Form.Group>;
}

function FilterSetToggle({name, value, toggle, state, invert}: {invert?: boolean, name: string, value: string, toggle: (symbol: string) => void, state: Set<string>}) {
    return <div onClick={() => toggle(value)} className="filter-toggle">
        <Form.Check checked={(!!invert) !== state.has(value)}/>
        <>{name}</>
    </div>;
}

function FilterCostToggle({name, symbol, symbol_parts, toggle, state}: {name: string, symbol: string, symbol_parts: string[], toggle: (symbol: string) => void, state: Set<string>}) {
    return <div onClick={() => toggle(symbol)} className="filter-toggle">
        <Form.Check checked={state.has(symbol)}/>
        <SymbolSingle symbol_parts={symbol_parts}/>
        <>{name}</>
    </div>;
}

type KeysMatching<T, V> = {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T];

function FilterCostGroup<K extends KeysMatching<FilterParams["advanced"], Set<string>>>({name, keyName, state: stateAll, setState}: {
    name: string, 
    keyName: K, 
    state: Record<K, Set<string>>, 
    setState: Updater<FilterParams["advanced"]>
}) {

    const [open, setOpen] = useState(false);

    const state = stateAll[keyName];
    const toggle = useCallback((symbol: string) => setState(stateAll => {
        const state = stateAll[keyName] as Set<string>;
        if (state.has(symbol)) {
            state.delete(symbol);
        } else {
            state.add(symbol);
        }
    }), [keyName, setState]);

    return <Form.Group className="filter-group mb-3">
        <div className="filter-group-header">
            <div className="filter-group-header-text " onClick={() => setOpen(!open)}>
                <img className={joinClassNames(["icon", open && "open"])} src={IconArrow}/>
                <Form.Label className="mb-0">{name}</Form.Label>
            </div>
            <Button 
                size="sm" 
                variant="primary" 
                title={state.size === 8 ? "All options already selected" : "Select all options"}
                disabled={state.size === 8}
                onClick={() => setState(state => { state[keyName] = new Set<string>("WUBRGCSP"); })}
            >Select All</Button>
            <Button 
                size="sm" 
                variant="danger" 
                title={state.size === 0 ? "No options selected" : "Clear selection"}
                disabled={state.size === 0}
                onClick={() => setState(state => { state[keyName] = new Set<string>(); })}
            >Clear</Button>
        </div>
        <Collapse in={open}>
            <div className="filter-group-body-container bg-body-secondary">
                <div className="filter-group-body">
                    <FilterCostToggle name="White" symbol="W" symbol_parts={["W"]} state={state} toggle={toggle}/>
                    <FilterCostToggle name="Blue"  symbol="U" symbol_parts={["U"]} state={state} toggle={toggle}/>
                    <FilterCostToggle name="Black" symbol="B" symbol_parts={["B"]} state={state} toggle={toggle}/>
                    <FilterCostToggle name="Red"   symbol="R" symbol_parts={["R"]} state={state} toggle={toggle}/>
                    <FilterCostToggle name="Green" symbol="G" symbol_parts={["G"]} state={state} toggle={toggle}/>
                    
                    <FilterCostToggle name="Colorless" symbol="C" symbol_parts={["C"]}      state={state} toggle={toggle}/>
                    <FilterCostToggle name="Snow"      symbol="S" symbol_parts={["S"]}      state={state} toggle={toggle}/>
                    <FilterCostToggle name="Phyrexian" symbol="P" symbol_parts={["C", "P"]} state={state} toggle={toggle}/>
                </div>
            </div>
        </Collapse>
    </Form.Group>;
}

function FilterLegalityGroup<K extends KeysMatching<FilterParams["advanced"], Set<string>>>({name, keyName, state: stateAll, setState}: {
    name: string, 
    keyName: K, 
    state: Record<K, Set<string>>, 
    setState: Updater<FilterParams["advanced"]>
}) {

    const legalities = useDatabaseEnumInfo().legalities;

    const [open, setOpen] = useState(false);

    const state = stateAll[keyName];
    const toggle = useCallback((symbol: string) => setState(stateAll => {
        const state = stateAll[keyName] as Set<string>;
        if (state.has(symbol)) {
            state.delete(symbol);
        } else {
            state.add(symbol);
        }
    }), [keyName, setState]);

    return <Form.Group className="filter-group mb-3">
        <div className="filter-group-header">
            <div className="filter-group-header-text " onClick={() => setOpen(!open)}>
                <img className={joinClassNames(["icon", open && "open"])} src={IconArrow}/>
                <Form.Label className="mb-0">{name}</Form.Label>
            </div>
            <Button 
                size="sm" 
                variant="primary" 
                title={state.size === legalities.length ? "All options already selected" : "Select all selection"}
                disabled={state.size === legalities.length}
                onClick={() => setState(state => { state[keyName] = new Set<string>(legalities.map(v => v.key)); })}
            >Select All</Button>
            <Button 
                size="sm" 
                variant="danger" 
                title={state.size === 0 ? "No options selected" : "Clear selection"}
                disabled={state.size === 0}
                onClick={() => setState(state => { state[keyName] = new Set<string>(); })}
            >Clear</Button>
        </div>
        <Collapse in={open}>
            <div className="filter-group-body-container bg-body-secondary">
                <div className="filter-group-body">
                    {Array.from(legalities.values(), v => <FilterSetToggle key={v} name={v.name} value={v.key} state={state} toggle={toggle}/>)}
                </div>
            </div>
        </Collapse>
    </Form.Group>;
}

function applySimpleSearch(
    index: number,
    deckViewActions: DeckViewStoreActions,
    searchIndex: ReturnType<typeof useSearchIndex>,
    filterOptions: FilterParams["simple"],
) {
    const results = doSearch(searchIndex, filterOptions) ?? [];
    deckViewActions.setViewFilter(index, function*(cards) {
        for(const entry of cards) {
            if(results.includes(entry[0].uid)) {
                yield entry;
            }
        }
    });
}

function applyAdvancedSearch(
    index: number,
    deckViewActions: DeckViewStoreActions,
    searchIndex: ReturnType<typeof useSearchIndex>,
    filterOptions: FilterParams["advanced"],
) {
    const result = doMultiSearch(searchIndex, [
        [filterOptions.name, "name"],
        [filterOptions.text, "text"],
        [filterOptions.type, "type"],
    ]);
    
    deckViewActions.setViewFilter(index, function*(cards) {
        for(const entry of cards) {
            const card = entry[0];
            if(result && !result.includes(card.uid)) continue;

            if (!findLegalityIn(filterOptions.legalities, card.faces[0].legalities)) continue;
            
            if (!findSymbolAnyIn(filterOptions.costAny, card.faces[0].manaCost ?? "")) continue;
            if (!findSymbolAllIn(filterOptions.costAll, card.faces[0].manaCost ?? "")) continue;
            if (!findSymbolNoneIn(filterOptions.costNone, card.faces[0].manaCost ?? "")) continue;

            yield entry;
        }
    });
}
