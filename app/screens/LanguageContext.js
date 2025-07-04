import React, { createContext, useState, useContext } from "react";

const languages = {
  en: {
    Error: "Error",
    Fts : "Failed to save notes",
    SearchHere : "Search Here...",
    Notes : "Notes",
    NoNotes : "No Notes, tap on + icon to start",
    DNote : "Delete Note",
    DMess: "Are you sure you want to delete",
    Cancel : "Cancel",
    Del : "Delete",
    AddNote : " ",
    Title : "Title",
    Note: "Note",
    AppSettings: "App Settings",
    Theme: "Theme",
    Header: "Headers",
    itext1: "Change Font of Headers. Default Font is NType.",
    Colortheme: "Color Theme",
    itext2: "Change the Dark/light theme.",
    About: "About",
    Github: "Github Repository",
    GMess: "View or contribute to Github repository.",
    Version: "Version",
    Category: "Category",
  },
  jp: {
    Error: "エラー",
    Fts : "メモの保存に失敗しました",
    SearchHere : "メモを検索...",
    Notes : "メモ",
    NoNotes : "+ アイコンをタップでメモを作成します",
    DNote : "メモを削除",
    DMess : "このメモを削除してもよろしいですか？この操作は元に戻せません。",
    Cancel : "キャンセル",
    Del : "削除",
    AddNote : " メモを作成",
    Title : "タイトル",
    Note: "メモ",
    AppSettings: "アプリの設定",
    Theme: "テーマ",
    Header: "のヘッダー",
    itext1: "ヘッダーのフォントを NDot に変更します。デフォルトのフォントは NType です。",
    Colortheme: "カラーテーマ",
    itext2: "ライトまたはダークにテーマを変更します。",
    About: "アプリについて",
    Github: "Github リポジトリ",
    GMess: "このアプリはオープンソースです。GitHub リポジトリを閲覧や貢献ができます。",
    Version: "バージョン",
    Category: "Category",
  },
  de: {
    Error: "Fehler",
    Fts : "Fehler beim Speichern der Notiz",
    SearchHere : "Suche hier...",
    Notes : "Notizen",
    NoNotes : "Keine Notizen, drücke auf das + Icon um welche zu erstellen",
    DNote : "Notiz löschen",
    DMess: "Bist du sicher das du die Notiz löschen willst?",
    Cancel : "Abbrechen",
    Del : "Löschen",
    AddNote : " ",
    Title : "Titel",
    Note: "Notiz",
    AppSettings: "App Einstellungen",
    Theme: "Erscheinungsbild",
    Header: "Überschrift",
    itext1: "Ändere die Schriftart von Überschriften zu NDot. Die Standart Schriftart ist NType.",
    Colortheme: "Farben Erscheinungsbild",
    itext2: "Ändere zwischen Nacht / Tag Modus.",
    About: "Über",
    Github: "Github Repository",
    GMess: "App ist Open Source. Du kannst es über GitHub anschauen oder dabei helfen.",
    Version: "Version",
    Category: "Kategorie",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations: languages[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
