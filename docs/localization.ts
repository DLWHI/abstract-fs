import type { Labels, LabelProvider } from "../src/i18n/types";

// Example 1: override only a few labels with a partial object.
export const englishOverrides: Partial<Labels> = {
  empty: "This folder is empty",
  upload: "Upload",
  create_folder: "Create folder",
  confirm: "Confirm",
  cancel: "Cancel",
};

// Example 2: per-locale dictionary. Pick one object by language.
export const labelsByLocale: Record<string, Partial<Labels>> = {
  en: {
    empty: "This folder is empty",
    upload: "Upload",
    download: "Download",
  },
  es: {
    empty: "Esta carpeta está vacía",
    upload: "Subir",
    download: "Descargar",
  },
  fr: {
    empty: "Ce dossier est vide",
    upload: "Téléverser",
    download: "Télécharger",
  },
};

// Example 3: use a translation callback for a full i18n layer.
export const translate: LabelProvider = (key, params) => {
  const translations: Record<string, string> = {
    name: "Name",
    type: "Type",
    path: "Path",
    size: "Size",
    modified: "Modified",
    empty: "This folder is empty",
    preview: "Select a folder or file",
    select: "Select",
    loading: "Loading...",
    upload: "Upload",
    create_folder: "Create folder",
    folder_name: "Folder name",
    confirm: "Confirm",
    cancel: "Cancel",
    open: "Open",
    download: "Download",
    free: "Free {value}",
    used: "{used} used of {total}",
    file: "File",
    folder: "Folder",
    image: "Image",
    video: "Video",
  };

  const text = translations[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, token) =>
    String(params?.[token] ?? ""),
  );
};

// Example 4: combine translator with runtime locale toggling.
export function getLocaleLabels(lang: "en" | "es" | "fr"): Partial<Labels> {
  return labelsByLocale[lang] ?? labelsByLocale.en;
}

// Example 5: a small app-level translator that reads from your i18n framework.
export function makeTranslator(
  dictionary: Record<string, string>,
): LabelProvider {
  return (key, params) => {
    const text = dictionary[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, token) =>
      String(params?.[token] ?? ""),
    );
  };
}

// Example usage:
//
// <FSExplorer
//   provider={provider}
//   labels={labelsByLocale.es}
// />
//
// <FSExplorer
//   provider={provider}
//   t={translate}
// />
//
// <FSExplorer
//   provider={provider}
//   labels={getLocaleLabels(lang)}
// />
