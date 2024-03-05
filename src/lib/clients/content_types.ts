import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeArtisteFields {
    nom?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
}

export type TypeArtisteSkeleton = EntrySkeletonType<TypeArtisteFields, "artiste">;
export type TypeArtiste<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeArtisteSkeleton, Modifiers, Locales>;

export function isTypeArtiste<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeArtiste<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'artiste'
}

export interface TypeGallerieFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    oeuvres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeOeuvreSkeleton>>;
}

export type TypeGallerieSkeleton = EntrySkeletonType<TypeGallerieFields, "gallerie">;
export type TypeGallerie<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGallerieSkeleton, Modifiers, Locales>;

export function isTypeGallerie<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGallerie<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'gallerie'
}

export interface TypeLienFields {
    titre?: EntryFieldTypes.Symbol;
    route?: EntryFieldTypes.Symbol;
    externe?: EntryFieldTypes.Boolean;
    sousLiens?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLienSkeleton>>;
}

export type TypeLienSkeleton = EntrySkeletonType<TypeLienFields, "lien">;
export type TypeLien<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLienSkeleton, Modifiers, Locales>;

export function isTypeLien<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLien<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'lien'
}

export interface TypeLigneFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    logotype?: EntryFieldTypes.AssetLink;
    couleur?: EntryFieldTypes.Symbol;
    oeuvres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeOeuvreSkeleton>>;
}

export type TypeLigneSkeleton = EntrySkeletonType<TypeLigneFields, "ligne">;
export type TypeLigne<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLigneSkeleton, Modifiers, Locales>;

export function isTypeLigne<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLigne<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'ligne'
}

export interface TypeNavigationFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    liens?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLienSkeleton>>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<TypeNavigationFields, "navigation">;
export type TypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;

export function isTypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeNavigation<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'navigation'
}

export interface TypeOeuvreFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    numero: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    artiste?: EntryFieldTypes.EntryLink<TypeArtisteSkeleton>;
    couleur?: EntryFieldTypes.Symbol;
    vignette?: EntryFieldTypes.AssetLink;
    media?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    annee: EntryFieldTypes.Integer;
    dimensions?: EntryFieldTypes.Symbol;
    medium?: EntryFieldTypes.Symbol;
    mention?: EntryFieldTypes.Text;
    corps?: EntryFieldTypes.RichText;
}

export type TypeOeuvreSkeleton = EntrySkeletonType<TypeOeuvreFields, "oeuvre">;
export type TypeOeuvre<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeOeuvreSkeleton, Modifiers, Locales>;

export function isTypeOeuvre<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeOeuvre<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'oeuvre'
}

export interface TypePageFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    contenu?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGallerieSkeleton | TypeTextSkeleton>>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;

export function isTypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypePage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'page'
}

export interface TypeTextFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
}

export type TypeTextSkeleton = EntrySkeletonType<TypeTextFields, "text">;
export type TypeText<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTextSkeleton, Modifiers, Locales>;

export function isTypeText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'text'
}
