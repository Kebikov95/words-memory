// Помощники для e2e-тестов WordsMemory: сиды, уникальные имена, типы.

export type Lang = 'it' | 'en';

export type SeedWord = {
  id?: string;
  word: string;
  translation: string;
  transcription?: string;
  lang?: Lang;
  examples?: { text: string; translation: string; lang?: Lang }[];
  tags?: string[];
};

export function uniqueName(prefix = 'Профиль'): string {
  return `${prefix} ${Date.now()}`;
}

/** Приводит сид-слово к полному формату `wm_words_<uid>`. */
export function toStorageWord(w: SeedWord, idx: number) {
  return {
    id: w.id ?? `w${idx + 1}`,
    lang: w.lang ?? 'it',
    word: w.word,
    transcription: w.transcription ?? '',
    translation: w.translation,
    examples: (w.examples ?? []).map(e => ({
      text: e.text,
      translation: e.translation,
      lang: e.lang ?? w.lang ?? 'it',
    })),
    tags: w.tags ?? [],
    image: null,
    createdAt: '2026-01-01',
  };
}

/** Пять итальянских слов для тренировок: ровно 5, чтобы наборы были короткими. */
export const SEED_WORDS_IT: SeedWord[] = [
  { id: 'w1', word: 'mela', translation: 'яблоко', transcription: 'ˈmeːla' },
  { id: 'w2', word: 'casa', translation: 'дом', transcription: 'ˈkasa' },
  { id: 'w3', word: 'sole', translation: 'солнце', transcription: 'ˈsoːle' },
  { id: 'w4', word: 'vino', translation: 'вино', transcription: 'ˈviːno' },
  { id: 'w5', word: 'pane', translation: 'хлеб', transcription: 'ˈpane' },
];
