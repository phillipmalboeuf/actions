import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeArtisteFields {
    nom?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    nomFamille?: EntryFieldTypes.Symbol;
    prenom?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    lieuDeNaissance?: EntryFieldTypes.Symbol;
    anneeDeNaissance?: EntryFieldTypes.Integer;
    lieuDeDeces?: EntryFieldTypes.Symbol;
    anneDeDeces?: EntryFieldTypes.Integer;
}

export type TypeArtisteSkeleton = EntrySkeletonType<TypeArtisteFields, "artiste">;
export type TypeArtiste<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArtisteSkeleton, Modifiers, Locales>;

export function isTypeArtiste<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeArtiste<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'artiste'
}

export interface TypeGallerieFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    oeuvres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeOeuvreSkeleton>>;
}

export type TypeGallerieSkeleton = EntrySkeletonType<TypeGallerieFields, "gallerie">;
export type TypeGallerie<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGallerieSkeleton, Modifiers, Locales>;

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
export type TypeLien<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLienSkeleton, Modifiers, Locales>;

export function isTypeLien<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLien<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'lien'
}

export interface TypeLigneFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    logotype?: EntryFieldTypes.AssetLink;
    couleur?: EntryFieldTypes.Symbol;
    vignette?: EntryFieldTypes.AssetLink;
    lienVimeo?: EntryFieldTypes.Symbol;
    contexte?: EntryFieldTypes.RichText;
    oeuvres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeOeuvreSkeleton>>;
}

export type TypeLigneSkeleton = EntrySkeletonType<TypeLigneFields, "ligne">;
export type TypeLigne<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLigneSkeleton, Modifiers, Locales>;

export function isTypeLigne<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLigne<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'ligne'
}

export interface TypeNavigationFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    liens?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLienSkeleton>>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<TypeNavigationFields, "navigation">;
export type TypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;

export function isTypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeNavigation<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'navigation'
}

export interface TypeOeuvreFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    numero: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    artiste?: EntryFieldTypes.EntryLink<TypeArtisteSkeleton>;
    anneeEvenement: EntryFieldTypes.Integer;
    annee: EntryFieldTypes.Integer;
    anneeDeRealisation?: EntryFieldTypes.Symbol;
    couleur?: EntryFieldTypes.Symbol;
    vignette?: EntryFieldTypes.AssetLink;
    media?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    minZoom?: EntryFieldTypes.Number;
    maxZoom?: EntryFieldTypes.Number;
    format?: EntryFieldTypes.Symbol<"Large" | "Moyen" | "Petit">;
    dimensions?: EntryFieldTypes.Symbol;
    hauteur?: EntryFieldTypes.Number;
    largeur?: EntryFieldTypes.Number;
    profondeur?: EntryFieldTypes.Number;
    typologie?: EntryFieldTypes.Symbol;
    medium?: EntryFieldTypes.Symbol;
    droits?: EntryFieldTypes.Text;
    mention?: EntryFieldTypes.Text;
    corps?: EntryFieldTypes.RichText;
    historique?: EntryFieldTypes.RichText;
    publications?: EntryFieldTypes.RichText;
    historiqueTxt?: EntryFieldTypes.Text;
    publicationsTxt?: EntryFieldTypes.Text;
    credits?: EntryFieldTypes.RichText;
}

export type TypeOeuvreSkeleton = EntrySkeletonType<TypeOeuvreFields, "oeuvre">;
export type TypeOeuvre<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOeuvreSkeleton, Modifiers, Locales>;

export function isTypeOeuvre<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeOeuvre<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'oeuvre'
}

export interface TypePageFields {
    titre?: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    logotype?: EntryFieldTypes.AssetLink;
    format?: EntryFieldTypes.Symbol<"Large" | "Medium" | "Étroit">;
    contenu?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGallerieSkeleton | TypeTextSkeleton>>;
    credits?: EntryFieldTypes.RichText;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;

export function isTypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypePage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'page'
}

export interface TypeTextFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
}

export type TypeTextSkeleton = EntrySkeletonType<TypeTextFields, "text">;
export type TypeText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTextSkeleton, Modifiers, Locales>;

export function isTypeText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'text'
}
