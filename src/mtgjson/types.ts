// ////////////////////////////////////////////////////////////////// //
// // Typing and documentation extracted from the mtgjson website  // //
// //                 Use according to their terms                 // //
// ////////////////////////////////////////////////////////////////// //

export type CardAtomicFile = MtgFile<Record<string, CardAtomic[]>>;

/**
 * The contents of a mtgjson AtomicCards file
 */
export type MtgFile<T> = {
    /** 
     * Metadata about the file 
     **/
    meta: Meta;

    /** 
     * Data stored in the file
     **/
    data: T;
}

export type Meta = {
    /** 
     * The current release date in ISO 8601 format for the
     * MTGJSON build. 
     **/
    date: string;

    /** 
     * The current SemVer version for the MTGJSON build
     * appended with the build date. 
     **/
    version: string;
};

/**
 * Describes the properties of a single "atomic" card, an
 * oracle-like entity of a card that only has evergreen
 * properties that would never change from printing to
 * printing.
 */
export type CardAtomic = {

    /** 
     * The ASCII (Basic/128) code formatted card name with
     * no special unicode characters. 
     **/
    asciiName?: string;

    /** 
     * A list of attraction lights found on a card, 
     * available only to cards printed in certain Un-sets. 
     **/
    attractionLights?: number[];

    /** 
     * A list of all the colors found in manaCost,
     * colorIndicator, and text properties. 
     **/
    colorIdentity: string[];

    /** 
     * A list of all the colors in the color indicator.
     * This is the symbol prefixed to a card's types. 
     **/
    colorIndicator?: string[];

    /** 
     * A list of all the colors in manaCost and 
     * colorIndicator properties. Some cards may not have 
     * values, such as cards with "Devoid" in its text. 
     **/
    colors: string[];

    /** 
     * @deprecated Use the manaValue property instead. 
     **/
    convertedManaCost: number;

    /** 
     * The defense of the card. Used on battle cards. 
     **/
    defense?: string;

    /** 
     * The card rank on EDHRec. 
     **/
    edhrecRank?: number;

    /** 
     * The card saltiness score on EDHRec. 
     **/
    edhrecSaltiness?: number;

    /** 
     * @deprecated  Use the faceManaValue property instead. 
     **/
    faceConvertedManaCost?: number;

    /** 
     * The mana value of the face for either half or part
     * of the card. 
     **/
    faceManaValue?: number;

    /** 
     * The name on the face of the card. 
     **/
    faceName?: string;

    /** 
     * The set code the card was first printed in. 
     **/
    firstPrinting?: string;

    /** 
     * A list of data properties in other languages. 
     **/
    foreignData?: ForeignData[];

    /**
     * The starting maximum hand size total modifier. 
     * A + or - character precedes a number. Used only on
     * cards with "Vanguard" in its types. 
     **/
    hand?: string;

    /** 
     * If the card allows a value other than 4 copies in a deck. 
     **/
    hasAlternativeDeckLimit?: boolean;

    /** 
     * The identifiers associated to a card.
     **/
    identifiers: Identifiers;

    /**
     * If the card is part of a funny set, such as an Un-set.
     **/
    isFunny?: boolean;

    /**
     * If the card is a part of the game changers commander list.
     **/
    isGameChanger?: boolean;

    /**
     * If the card is on the Magic: The Gathering Reserved List.
     **/
    isReserved?: boolean;

    /**
     * A list of keywords found on the card.
     **/
    keywords?: string[];

    /** 
     * The type of card layout.
     **/
    layout: string;

    /**
     * The formats the card is legal to be a commander in.
     **/
    leadershipSkills?: LeadershipSkills;

    /**
     * The legalities of play formats for this printing
     * of the card.
     **/
    legalities: Legalities;

    /**
     * The starting life total modifier. A + or - character
     * precedes a number. Used only on cards with
     * "Vanguard" in its types.
     **/
    life?: string;

    /** 
     * The starting loyalty value of the card. Used only on
     * cards with "Planeswalker" in its types. 
     **/
    loyalty?: string;

    /** 
     * The mana cost of the card wrapped in curly brackets
     * for each mana symbol value. 
     **/
    manaCost?: string;

    /** The mana value of the card. */
    manaValue: number;

    /** 
     * The name of the card. Cards with multiple faces are
     * given a // delimiter. 
     **/
    name: string;

    /** 
     * The power of the card. 
     **/
    power?: string;

    /** 
     * A list of printing set codes the card was printed
     * in, formatted in uppercase. 
     **/
    printings?: string[];

    /** 
     * Links that navigate to websites where the card can
     * be purchased.
     **/
    purchaseUrls: PurchaseUrls;

    /**
     * The related cards for this card.
     **/
    relatedCards: RelatedCards;

    /**
     * A list of the official rulings of the card.
     **/
    rulings?: Rulings[];

    /**
     * The identifier of the card side. Used on cards with
     * multiple faces on the same card.
     **/
    side?: string;

    /**
     * The names of the subset printings a card is in.
     * Used primarily on "Secret Lair Drop" cards. 
     **/
    subsets?: string[];

    /** A list of card subtypes found after em-dash. */
    subtypes: string[];

    /** A list of card supertypes found before em-dash. */
    supertypes: string[];

    /** The rules text of the card. */
    text?: string;

    /** The toughness of the card. */
    toughness?: string;

    /**
     * The type of the card as visible, including any
     * supertypes and subtypes are given a - delimiter
     * if appropriate. 
     **/
    type: string;

    /** 
     * A list of all card types of the card, including
     * Un‑sets and gameplay variants. 
     **/
    types: string[];
};

/**
 * Describes the properties for a card in alternate languages
 */
export type ForeignData = {
    /** 
     * The foreign name on the face of the card. 
     **/
    faceName?: string;

    /** 
     * The foreign flavor text of the card. 
     **/
    flavorText?: string;

    /** 
     * The identifiers associated to a card.
     **/
    identifiers: Identifiers;

    /** 
     * The foreign language of card. 
     **/
    language: string;

    /** 
     * The foreign name of the card. 
     **/
    name: string;

    /** 
     * The foreign text of the card. 
     **/
    text?: string;

    /** 
     * The foreign type of the card, including any
     * supertypes and subtypes, and are given a - delimiter
     * if appropriate. 
     **/
    type?: string;

    /** 
     * The universal unique identifier (v5) generated
     * by MTGJSON. 
     **/
    uuid: string;
};

/**
 * Describes the properties of identifiers associated
 * to a card or product.
 */
export type Identifiers = {
    /** 
     * The ABUGames identifier. 
     **/
    abuId?: string;

    /**
     * The Card Kingdom etched card identifier.
     **/
    cardKingdomEtchedId?: string;

    /**
     * The Card Kingdom foil card identifier.
     **/
    cardKingdomFoilId?: string;

    /**
     * The Card Kingdom card identifier.
     **/
    cardKingdomId?: string;

    /**
     * The Cardsphere card identifier.
     **/
    cardsphereId?: string;

    /**
     * The Cardsphere foil card identifier.
     **/
    cardsphereFoilId?: string;

    /**
     * The Card Trader card identifier.
     **/
    cardtraderId?: string;

    /**
     * The CoolStuffInc identifier.
     **/
    csiId?: string;

    /**
     * The Cardmarket card identifier.
     **/
    mcmId?: string;

    /**
     * The Cardmarket card meta identifier.
     **/
    mcmMetaId?: string;

    /**
     * The Miniature Market identifier.
     **/
    miniaturemarketId?: string;

    /**
     * The Magic: The Gathering Arena card identifier.
     **/
    mtgArenaId?: string;

    /**
     * The universal unique identifier (v4) generated
     * by MTGJSON for the foil version of the card.
     * */
    mtgjsonFoilVersionId?: string;

    /** 
     * The universal unique identifier (v4) generated 
     * by MTGJSON for the non-foil version of the card. 
     **/
    mtgjsonNonFoilVersionId?: string;

    /**
     * The universal unique identifier (v4) generated
     * by MTGJSON. 
     **/
    mtgjsonV4Id?: string;

    /** 
     * The Magic: The Gathering Online card foil
     * identifier. 
     **/
    mtgoFoilId?: string;

    /** 
     * The Magic: The Gathering Online card identifier. 
     **/
    mtgoId?: string;

    /** 
     * The Wizards of the Coast card identifier used in
     * conjunction with Gatherer. 
     **/
    multiverseId?: string;

    /** The StarCityGames identifier. */
    scgId?: string;

    /** 
     * The universal unique identifier generated by
     * Scryfall. Note that cards with multiple faces
     * are not unique. 
     **/
    scryfallId?: string;

    /** 
     * The universal unique identifier generated by
     * Scryfall for the back face of a card. 
     **/
    scryfallCardBackId?: string;

    /**
     * The unique identifier generated by Scryfall for
     * this card's oracle identity. This value is
     * consistent across reprinted card editions, and
     * unique among different cards with the same name
     * (Un-sets, tokens, etc). 
     **/
    scryfallOracleId?: string;

    /** 
     * The unique identifier generated by Scryfall for
     * the card artwork that remains consistent across
     * reprints. Newly previewed cards may not have this
     * property yet. 
     **/
    scryfallIllustrationId?: string;

    /** 
     * The TCGplayer card identifier. 
     **/
    tcgplayerProductId?: string;

    /** 
     * The TCGplayer etched card identifier. 
     **/
    tcgplayerEtchedProductId?: string;

    /** 
     * The Troll and Toad identifier. 
     **/
    tntId?: string;
};

export type LeadershipSkills = {
    /** 
     * If the card can be your commander in
     * the Standard Brawl format. 
     **/
    brawl: boolean;

    /** 
     * If the card can be your commander in
     * the Commander/EDH format.
     **/
    commander: boolean;

    /** 
     * If the card can be your commander in
     * the Oathbreaker format. 
     **/
    oathbreaker: boolean;
};

/**
 * Describes the properties of formats that a card is legal
 * to be your Commander in play formats that utilize
 * Commanders.
 */
export type Legalities = {
    /**
     * Legality of the card in the Alchemy play format.
     **/
    alchemy?: string;

    /**
     * Legality of the card in the Brawl play format.
     **/
    brawl?: string;

    /**
     * Legality of the card in the Commander play format.
     **/
    commander?: string;

    /**
     * Legality of the card in the Duel Commander play format.
     **/
    duel?: string;

    /**
     * Legality of the card in the Explorer play format.
     **/
    explorer?: string;

    /**
     * Legality of the card in the future for the Standard play format.
     **/
    future?: string;

    /**
     * Legality of the card in the Gladiator play format.
     **/
    gladiator?: string;

    /**
     * Legality of the card in the Historic play format.
     **/
    historic?: string;

    /**
     * Legality of the card in the Historic Brawl play format.
     **/
    historicbrawl?: string;

    /**
     * Legality of the card in the Legacy play format.
     **/
    legacy?: string;

    /**
     * Legality of the card in the Modern play format.
     **/
    modern?: string;

    /**
     * Legality of the card in the Oathbreaker play format.
     **/
    oathbreaker?: string;

    /**
     * Legality of the card in the Old School play format.
     **/
    oldschool?: string;

    /**
     * Legality of the card in the Pauper play format.
     **/
    pauper?: string;

    /**
     * Legality of the card in the Pauper Commander play format.
     **/
    paupercommander?: string;

    /**
     * Legality of the card in the Penny Dreadful play format.
     **/
    penny?: string;

    /**
     * Legality of the card in the Pioneer play format.
     **/
    pioneer?: string;

    /**
     * Legality of the card in the PreDH play format.
     **/
    predh?: string;

    /**
     * Legality of the card in the Premodern play format.
     **/
    premodern?: string;

    /**
     * Legality of the card in the Standard play format.
     **/
    standard?: string;

    /**
     * Legality of the card in the Standard Brawl
     * play format.
     **/
    standardbrawl?: string;

    /**
     * Legality of the card in the Timeless play format.
     **/
    timeless?: string;

    /**
     * Legality of the card in the Vintage play format.
     **/
    vintage?: string;
};

/**
 * Describes the properties of links to purchase a product
 * from a marketplace.
 */
export type PurchaseUrls = {
    /**
     * The URL to purchase a product on Card Kingdom.
     **/
    cardKingdom?: string;

    /**
     * The URL to purchase an etched product on Card Kingdom.
     **/
    cardKingdomEtched?: string;

    /**
     * The URL to purchase a foil product on Card Kingdom.
     **/
    cardKingdomFoil?: string;

    /**
     * The URL to purchase a product on Cardmarket.
     **/
    cardmarket?: string;

    /**
     * The URL to purchase a product on TCGplayer.
     **/
    tcgplayer?: string;

    /**
     * The URL to purchase an etched product on TCGplayer.
     **/
    tcgplayerEtched?: string;
};

/**
 * Describes the properties of rulings for a card.
 */
export type Rulings = {
    /**
     * The release date in ISO 8601 format for the rule.
     **/
    date: string;

    /**
     * The text ruling of the card.
     **/
    text: string;
};

/**
 * Describes the properties of a card that has relations
 * to other cards.
 */
export type RelatedCards = {
    /**
     * A list of card names associated to a card, such
     * as "meld" cards and token creation. 
     **/
    reverseRelated?: string[];

    /** 
     * A list of card names associated to a card's
     * Spellbook mechanic.
     **/
    spellbook?: string[];
};