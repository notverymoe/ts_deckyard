// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./symbols.css";

import { useMemo } from "preact/hooks";
import SvgSymbols from "/icons/cost-symbols.svg";

const REGEX_COST_SYMBOLS = /{(.+?)}/g;

export function* parseSymbols(v: string): Generator<["text", string] | ["cost", string[][]]> {
    let last = 0;
    let symbols = [];

    for(let match of v.matchAll(REGEX_COST_SYMBOLS)) {
        if (last != match.index) {
            // Output symbols first if there was a gap
            if (symbols.length > 0) {
                yield ["cost", symbols];
                symbols = [];
            }

            // Then output the text before the new symbol encountered
            yield ["text", v.substring(last, match.index)];
        }

        // Cache encountered symbol so set can be emitted at the same time
        symbols.push(match[1].split("/"));

        // Update text "from" position. Using match length produced some issues.
        last = match.index + match[1].length + 2;
    }

    // Flush cached symbols before outputting the remaining text
    if (symbols.length > 0) {
        yield ["cost", symbols];
        symbols = [];
    }

    // FLush remaining text
    if (last < v.length) {
        yield ["text", v.substring(last)];
    }
}

export function* parseSymbolsCostOnly(v: string): Generator<string[]> {
    for(let match of v.matchAll(REGEX_COST_SYMBOLS)) {
        yield match[1].split("/");
    }
}

const BG_COLOURLESS = "bg-symbol-colourless";
const BG_UNTAP      = "bg-symbol-untap";
const BG_WHITE      = "bg-symbol-white";
const BG_BLUE       = "bg-symbol-blue";
const BG_BLACK      = "bg-symbol-black";
const BG_RED        = "bg-symbol-red";
const BG_GREEN      = "bg-symbol-green";
const BG_HWHITE     = "bg-symbol-hwhite";
const BG_HRED       = "bg-symbol-hred";

type SymbolData = {
    id: string,
    bg?: string,
}

const COST_SYMBOLS_KNOWN: Record<string, SymbolData> = {
    "W":  {id: "W", bg: BG_WHITE},
    "U":  {id: "U", bg: BG_BLUE },
    "B":  {id: "B", bg: BG_BLACK},
    "R":  {id: "R", bg: BG_RED  },
    "G":  {id: "G", bg: BG_GREEN},

    "0":   {id: "0", bg: BG_COLOURLESS},
    "1":   {id: "1", bg: BG_COLOURLESS},
    "2":   {id: "2", bg: BG_COLOURLESS},
    "3":   {id: "3", bg: BG_COLOURLESS},
    "4":   {id: "4", bg: BG_COLOURLESS},
    "5":   {id: "5", bg: BG_COLOURLESS},
    "6":   {id: "6", bg: BG_COLOURLESS},
    "7":   {id: "7", bg: BG_COLOURLESS},
    "8":   {id: "8", bg: BG_COLOURLESS},
    "9":   {id: "9", bg: BG_COLOURLESS},
    
    "10":  {id: "10", bg: BG_COLOURLESS},
    "11":  {id: "11", bg: BG_COLOURLESS}, 
    "12":  {id: "12", bg: BG_COLOURLESS},
    "13":  {id: "13", bg: BG_COLOURLESS},
    "14":  {id: "14", bg: BG_COLOURLESS},
    "15":  {id: "15", bg: BG_COLOURLESS},
    "16":  {id: "16", bg: BG_COLOURLESS},
    "17":  {id: "17", bg: BG_COLOURLESS},
    "18":  {id: "18", bg: BG_COLOURLESS},
    "19":  {id: "19", bg: BG_COLOURLESS},
    "20":  {id: "20", bg: BG_COLOURLESS},

    "100": {id: "100", bg: BG_COLOURLESS},

    "1000000": {id: "1000000", bg: BG_COLOURLESS},

    "T":  {id: "T", bg: BG_COLOURLESS},
    "C":  {id: "C", bg: BG_COLOURLESS},
    "X":  {id: "X", bg: BG_COLOURLESS},
    "S":  {id: "S", bg: BG_COLOURLESS},
    "A":  {id: "A", bg: BG_COLOURLESS},
    "P":  {id: "P", bg: BG_COLOURLESS},
    "Z":  {id: "Z", bg: BG_COLOURLESS},
    "Y":  {id: "Y", bg: BG_COLOURLESS},

    "∞":  {id: "INF", bg: BG_COLOURLESS},
    "½":  {id: "HALF", bg: BG_COLOURLESS},

    "Q":  {id: "Q",  bg: BG_UNTAP},
    "HW": {id: "HW", bg: BG_HWHITE},
    "HR": {id: "HR", bg: BG_HRED},

    "D":     {id: "D"},
    "L":     {id: "L"},
    "H":     {id: "H"},
    "E":     {id: "E"},
    "TK":    {id: "TK"},
    "CHAOS": {id: "CHAOS"},
};

const COST_SYMBOLS_UNKNOWN: SymbolData = {id: "UNKNOWN"}; 

function getCostSymbolData(symbols_parts: string[]): [string[], string[]] {
    let symbols     = []
    let backgrounds = [];

    let cost_unknown = false;
    for(const part of symbols_parts.filter(v => v !== "P")) {
        let symbol_data = COST_SYMBOLS_KNOWN[part];
        if(symbol_data === undefined) {
            symbol_data = COST_SYMBOLS_UNKNOWN;
            cost_unknown = true;
        }

        symbols.push(symbol_data.id);
        if (symbol_data.bg) backgrounds.push(symbol_data.bg);
    }

    if (symbols_parts.includes("P")) {
        symbols = symbols.map(() => COST_SYMBOLS_KNOWN["P"].id);

        if(backgrounds.length == 0) {
            backgrounds.push(COST_SYMBOLS_KNOWN["P"].bg!);
        }
    }

    if(cost_unknown) {
        console.log("Cost includes unhandled symbol! " + symbols_parts.join(", "));
        return [[COST_SYMBOLS_UNKNOWN.id], []];
    }

    return [
        symbols.slice(0, Math.min(symbols.length, 2)),
        backgrounds.slice(0, Math.min(backgrounds.length, 2)),
    ]

}

type ManaSymbolProps = {
    symbols:     string[],
    backgrounds: string[],
    title?:      string,
};

export function SymbolSetCards({costs, delim}: {costs: string[], delim?: string}) {
    const sets = useMemo(
        () => costs.map(cost => [...parseSymbolsCostOnly(cost)].map(symbol_parts => getCostSymbolData(symbol_parts))).filter(v => v.length != 0), 
        [costs]
    );
    return <>
        {sets.flatMap((set, i) => <>
            {
                set.map(([symbols, backgrounds], j) => <>
                    <SymbolRaw key={j} symbols={symbols} backgrounds={backgrounds} title={costs[i]}/>
                </>)
            }
            {(i+1 < sets.length) && (delim ?? "//")}
        </>)}
    </>;
}

export function SymbolSet({symbols}: {symbols: string[][]}) {
    const symbols_parsed = useMemo(() => symbols.map(symbol_parts => getCostSymbolData(symbol_parts)), [symbols]);
    return <>{symbols_parsed.map(([symbols, backgrounds], i) => <SymbolRaw key={i} symbols={symbols} backgrounds={backgrounds}/>)}</>;
}

export function Symbol({symbol_parts}: {symbol_parts: string[]}) {
    const [symbols, backgrounds] = useMemo(() => getCostSymbolData(symbol_parts), [symbol_parts]);
    return <SymbolRaw symbols={symbols} backgrounds={backgrounds}/>
}

export function SymbolRaw({symbols, backgrounds, title}: ManaSymbolProps) {
    if (symbols.length > 2) {
        console.log("Long symbol list: " + symbols.join(", "));
    }

    // TODO more titles for other sources

    return <div className={`cost-symbol-container ${backgrounds.length > 0 ? "bordered" : "borderless"}`} title={title}>
        {backgrounds.length >= 2 
            ? <>
                <div className={`bg-symbol-left ${backgrounds[0]}`}/>
                <div className={`bg-symbol-right ${backgrounds[1]}`}/>
            </> : <>
                {backgrounds.length > 0 && <div className={`bg-symbol-full ${backgrounds[0]}`}/>}
            </>
        }
        {symbols.length >= 2
            ? <>
                <SvgSymbol id={symbols[0]} kind="left" />
                <SvgSymbol id={symbols[1]} kind="right"/>
            </> : <>
                {symbols.length > 0 && <SvgSymbol id={symbols[0]} kind="full"/>}
            </>
        }
    </div>;
}

export function SvgSymbol({id, kind}: {id: string, kind: "left" | "right" | "full"}) {
    return <svg className={`cost-symbol-${kind}`} viewBox="0 0 16 16">
        <use href={`${SvgSymbols}#${id}`}/>
    </svg>;
}