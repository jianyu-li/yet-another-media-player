import en from './languages/en.js';
import de from './languages/de.js';
import fr from './languages/fr.js';
import es from './languages/es.js';
import it from './languages/it.js';
import pt from './languages/pt.js';
import nl from './languages/nl.js';

const languages = {
    en,
    de,
    es,
    fr,
    it,
    nl,
    pt,
};

export function localize(string, search = '', replace = '') {
    const rawLang = (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
    const lang = languages[rawLang] ? rawLang : rawLang.split('_')[0];

    let translated;
    const parts = string.split('.');

    const traverse = (obj, path) => {
        try {
            return path.reduce((o, i) => (o && o[i] !== undefined ? o[i] : undefined), obj);
        } catch (e) {
            return undefined;
        }
    };

    translated = traverse(languages[lang], parts);
    if (translated === undefined && lang !== 'en') {
        translated = traverse(languages['en'], parts);
    }
    if (translated === undefined) {
        translated = string;
    }

    if (typeof translated !== 'string') {
        translated = string;
    }

    if (search !== '' && replace !== '') {
        translated = translated.replace(search, replace);
    }
    return translated;
}
