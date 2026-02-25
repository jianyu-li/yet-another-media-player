export default {
    "common": {
        "not_found": "Entita sa nenašla.",
        "search": "Hľadať",
        "power": "Napájanie",
        "favorite": "Obľúbené",
        "loading": "Načítava sa...",
        "no_results": "Žiadne výsledky.",
        "close": "Zatvoriť",
        "vol_up": "Zvýšiť hlasitosť",
        "vol_down": "Znížiť hlasitosť",
        "media_player": "Prehrávač médií",
        "edit_entity": "Upraviť nastavenia entity",
        "edit_action": "Upraviť nastavenia akcie",
        "mute": "Stlmiť",
        "unmute": "Zrušiť stlmenie",
        "seek": "Posunúť",
        "volume": "Hlasitosť",
        "play_now": "Prehrať teraz",
        "more_options": "Viac možností",
        "unavailable": "Nedostupné",
        "back": "Späť",
        "cancel": "Zrušiť",
        "reset_default": "Obnoviť predvolené"
    },
    "editor": {
        "tabs": {
            "entities": "Entity",
            "behavior": "Správanie",
            "look_and_feel": "Vzhľad a dojem",
            "artwork": "Grafika",
            "actions": "Akcie"
        },
        "placeholders": {
            "search": "Hľadať hudbu..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Všeobecné nastavenia",
                    "description": "Globálne ovládanie toho, ako sa grafika zobrazuje a získava."
                },
                "idle": {
                    "title": "Grafika pri nečinnosti",
                    "description": "Zobraziť statický obrázok alebo snímku entity, keď sa nič neprehráva."
                },
                "overrides": {
                    "title": "Prepísania grafiky",
                    "description": "Prepísania sa vyhodnocujú zhora nadol. Poradie zmeníte potiahnutím."
                }
            },
            "entities": {
                "title": "Entity*",
                "description": "Pridajte prehrávače médií, ktoré chcete ovládať. Potiahnutím entít zmeníte poradie v riadku čipov."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Nečinnosť a čipy",
                    "description": "Vyberte, kedy karta prejde do nečinnosti a ako sa správajú čipy entít."
                },
                "interactions_search": {
                    "title": "Interakcie a hľadanie",
                    "description": "Doladenie pripínania entít a počtu zobrazených výsledkov."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Téma a rozloženie",
                    "description": "Prispôsobte štýl panelu a ovládajte celkový vzhľad."
                },
                "controls_typography": {
                    "title": "Ovládanie a typografia",
                    "description": "Nastavenie veľkosti tlačidiel, štítkov entít a adaptívneho textu."
                },
                "collapsed_idle": {
                    "title": "Zbalené stavy a nečinnosť",
                    "description": "Ovládajte, kedy sa karta zbalí a ktoré zobrazenia sa ukážu počas nečinnosti."
                }
            },
            "actions": {
                "title": "Akcie",
                "description": "Vytvorte akčné čipy, ktoré sa zobrazia na karte alebo v jej menu. Potiahnutím zmeníte poradie, kliknutím na ceruzku akciu nakonfigurujete."
            }
        },
        "subtitles": {
            "idle_timeout": "Čas v milisekundách, kým karta prejde do režimu nečinnosti. Nastavte na 0 pre vypnutie.",
            "show_chip_row": "\"Auto\" skryje riadok čipov, ak je nakonfigurovaná len jedna entita. \"V menu\" presunie čipy do ponuky menu. \"V menu pri nečinnosti\" zobrazí čipy v riadku keď je aktívne, ale presunie ich do menu pri nečinnosti.",
            "dim_chips": "Keď karta prejde do režimu nečinnosti s obrázkom, stlmte čipy entít a akcií pre čistejší vzhľad.",
            "hold_to_pin": "Dlhým stlačením čipov entít ich pripnete, čím zabránite automatickému prepínaniu počas prehrávania.",
            "always_show_group": "Ovládacie prvky rýchleho zoskupovania (+/-/hviezdička) budú predvolene viditeľné pri načítaní stránky. Stále ich môžete manuálne prepínať dvojitým klepnutím.",
            "disable_autofocus": "Zabráni vyhľadávaciemu poľu prebrať zameranie, aby zostali klávesnice na obrazovke skryté.",
            "search_within_filter": "Povoliť vyhľadávanie v rámci aktuálneho aktívneho filtra (Obľúbené, Nedávno prehrávané atď.) namiesto jeho vymazania.",
            "close_search_on_play": "Automaticky zatvoriť obrazovku vyhľadávania po spustení skladby.",
            "pin_search_headers": "Ponechať pole vyhľadávania a filtre pevne navrchu počas posúvania výsledkov.",
            "hide_search_headers_on_idle": "Skryť vyhľadávanie a filtre, keď je prehrávač nečinný.",
            "disable_mass": "Deaktivovať voliteľnú integráciu Mass Queue, aj keď je nainštalovaná.",
            "swap_pause_stop": "Nahradiť tlačidlo pauzy tlačidlom zastavenia pri použití moderného rozloženia.",
            "adaptive_controls": "Umožniť tlačidlám prehrávania meniť veľkosť podľa dostupného priestoru.",
            "hide_menu_player": "Keď sú čipy v menu, skryť názov entity v spodnej časti karty.",
            "adaptive_text": "Vyberte skupiny textu, ktoré sa majú škálovať podľa priestoru (nechajte prázdne pre vypnutie).",
            "collapse_expand": "\"Vždy zbalené\" vytvorí režim mini prehrávača. \"Rozbaliť pri hľadaní\" kartu dočasne rozbalí pri vyhľadávaní.",
            "idle_screen": "Vyberte obrazovku, ktorá sa má automaticky zobraziť v režime nečinnosti.",
            "hide_controls": "Vyberte ovládacie prvky, ktoré chcete pre túto entitu skryť (štandardne sú zobrazené všetky).",
            "hide_search_chips": "Skryť konkrétne čipy filtra vyhľadávania pre túto entitu.",
            "follow_active_entity": "Ak je povolené, entita hlasitosti bude automaticky sledovať aktívny prehrávač. Poznámka: Toto prepíše vybranú entitu hlasitosti.",
            "search_limit_full": "Maximálny počet výsledkov vyhľadávania (1-1000, predvolené: 20).",
            "default_search_filter_full": "Vyberte, ktorý filter bude predvolene aktívny pri otvorení vyhľadávania.",
            "default_search_favorites": "Spustiť vyhľadávanie s aktívnymi obľúbenými",
            "result_sorting_full": "Vyberte spôsob zoradenia výsledkov. Predvolené ponecháva poradie zo zdroja.",
            "card_height_full": "Nechajte prázdne pre automatickú výšku.",
            "control_layout_full": "Vyberte si medzi starším (rovnako veľké prvky) alebo moderným rozložením Home Assistant.",
            "artwork_extend": "Umožniť pozadiu grafiky pokračovať pod riadkami čipov a akcií.",
            "artwork_extend_label": "Rozšíriť grafiku",
            "no_artwork_overrides": "Nie sú nastavené žiadne prepísania grafiky. Pridajte ich pomocou tlačidla plus.",
            "entity_current_hint": "Použite 'entity_id: current' na zacielenie aktuálne vybranej entity na karte. Poznámka: Tlačidlo 'Testovať akciu' bude v tomto prípade neaktívne.",
            "service_data_note": "Zmeny v servisných údajoch sa neuložia, kým nekliknete na tlačidlo 'Uložiť servisné údaje'!",
            "jinja_template_hint": "Zadajte Jinja šablónu, ktorá vráti jedno entity_id. Príklad prepínania MA na základe výberu zdroja:",
            "jinja_template_vol_hint": "Zadajte Jinja šablónu, ktorá vráti entity_id (napr. media_player.obyvacka). Príklad prepínania hlasitosti podľa stavu:",
            "not_available_alt_collapsed": "Nedostupné s alternatívnym indikátorom priebehu alebo v režime Vždy zbalené.",
            "not_available_collapsed": "Nedostupné, keď je zapnuté Vždy zbalené.",
            "only_available_collapsed": "Dostupné len pri zapnutom režime Vždy zbalené.",
            "only_available_modern": "Dostupné len s moderným rozložením.",
            "image_url_helper": "Zadajte priamu URL na obrázok alebo lokálnu cestu k súboru",
            "selected_entity_helper": "Pomocník pre vstupný text, ktorý bude aktualizovaný o ID aktuálne vybranej entity prehrávača médií.",
            "sync_entity_type": "Vyberte, ktoré ID entity sa má synchronizovať s pomocníkom (predvolene entita Music Assistant, ak je nakonfigurovaná).",
            "disable_auto_select": "Zabráni automatickému výberu čipu tejto entity pri spustení prehrávania.",
            "search_view": "Vyberte si medzi štandardným zoznamom alebo mriežkou kariet pre výsledky vyhľadávania.",
            "search_card_columns": "Zadajte, koľko stĺpcov sa má použiť v zobrazení karty. Grafika sa automaticky prispôsobí."
        },
        "titles": {
            "edit_entity": "Upraviť entitu",
            "edit_action": "Upraviť akciu",
            "service_data": "Servisné údaje",
            "add_artwork_override": "Pridať prepísanie grafiky"
        },
        "labels": {
            "dim_chips": "Stlmiť čipy pri nečinnosti",
            "hold_to_pin": "Podržať pre pripnutie",
            "always_show_group": "Rýchle zoskupovanie ako predvolené",
            "disable_autofocus": "Vypnúť automatické zameranie hľadania",
            "keep_filters": "Zachovať filtre pri hľadaní",
            "dismiss_on_play": "Zavrieť hľadanie po spustení",
            "default_search_filter": "Predvolený filter vyhľadávania",
            "default_search_favorites": "Predvolený filter obľúbených",
            "pin_headers": "Pripnúť hlavičky hľadania",
            "hide_search_headers_on_idle": "Skryť hlavičky pri nečinnosti",
            "disable_mass": "Deaktivovať Mass Queue",
            "match_theme": "Podľa témy",
            "alt_progress": "Alternatívny indikátor priebehu",
            "display_timestamps": "Zobraziť časové údaje",
            "swap_pause_stop": "Vymeniť pauzu za stop",
            "adaptive_controls": "Adaptívna veľkosť ovládania",
            "hide_active_entity": "Skryť štítok aktívnej entity",
            "collapse_on_idle": "Zbaliť pri nečinnosti",
            "hide_menu_player_toggle": "Skryť prehrávač v menu",
            "always_collapsed": "Vždy zbalené",
            "expand_on_search": "Rozbaliť pri hľadaní",
            "script_var": "Premenná skriptu (yamp_entity)",
            "use_ma_template": "Použiť šablónu pre Music Assistant",
            "use_vol_template": "Použiť šablónu pre entitu hlasitosti",
            "follow_active_entity": "Hlasitosť sleduje aktívnu entitu",
            "use_url_path": "Použiť URL alebo cestu",
            "adaptive_text_elements": "Prvky s adaptívnou veľkosťou textu",
            "disable_auto_select": "Zakázať automatický výber"
        },
        "fields": {
            "artwork_fit": "Prispôsobenie grafiky",
            "artwork_position": "Pozícia grafiky",
            "artwork_hostname": "Hostname pre grafiku",
            "match_field": "Pole pre zhodu",
            "match_value": "Hodnota pre zhodu",
            "size_percent": "Veľkosť (%)",
            "object_fit": "Prispôsobenie objektu (Fit)",
            "idle_timeout": "Čas nečinnosti (ms)",
            "show_chip_row": "Zobraziť riadok čipov",
            "search_limit": "Limit výsledkov hľadania",
            "result_sorting": "Zoradenie výsledkov",
            "vol_step": "Krok hlasitosti (0.05 = 5%)",
            "card_height": "Výška karty (px)",
            "control_layout": "Rozloženie ovládania",
            "save_service_data": "Uložiť servisné údaje",
            "image_url": "URL obrázka",
            "fallback_image_url": "Záložná URL obrázka",
            "move_to_main": "Presunúť do hlavných čipov",
            "move_to_menu": "Presunúť do menu",
            "delete_action": "Vymazať akciu",
            "revert_service_data": "Vrátiť uložené servisné údaje",
            "test_action": "Testovať akciu",
            "volume_mode": "Režim hlasitosti",
            "idle_screen": "Obrazovka pri nečinnosti",
            "name": "Názov",
            "hidden_controls": "Skryté ovládacie prvky",
            "ma_template": "Jinja šablóna pre Music Assistant",
            "hidden_chips": "Skryté čipy filtrov hľadania",
            "vol_template": "Jinja šablóna pre hlasitosť",
            "icon": "Ikona",
            "action_type": "Typ akcie",
            "menu_item": "Položka menu",
            "nav_path": "Cesta navigácie",
            "service": "Služba",
            "service_data": "Servisné údaje",
            "idle_image_entity": "Entita obrázka pri nečinnosti",
            "match_entity": "Entita pre zhodu",
            "ma_entity": "Entita Music Assistant",
            "vol_entity": "Entita hlasitosti",
            "selected_entity_helper": "Pomocník vybratej entity",
            "sync_entity_type": "Typ entity na synchronizáciu",
            "placement": "Umiestnenie",
            "card_trigger": "Spúšťač karty",
            "search_view": "Zobrazenie výsledkov vyhľadávania",
            "search_card_columns": "Stĺpce karty"
        },
        "action_types": {
            "menu": "Otvoriť položku menu karty",
            "service": "Zavolať službu",
            "navigate": "Navigovať",
            "sync_selected_entity": "Synchronizovať vybranú entitu"
        },
        "action_helpers": {
            "sync_selected_entity": "Synchronizovať vybranú entitu →",
            "select_helper": "(vybrať pomocníka)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Entita Music Assistant, ak je nakonfigurovaná)",
            "yamp_main_entity": "yamp_main_entity (Hlavná entita prehrávača médií)",
            "yamp_playback_entity": "yamp_playback_entity (Aktuálna aktívna entita prehrávania)"
        },
        "placements": {
            "chip": "Akčný čip",
            "menu": "V menu",
            "hidden": "Skryté (Ťuknutie na grafiku)",
            "not_triggerable": "Nespustiteľné"
        },
        "triggers": {
            "none": "Žiadny",
            "tap": "Ťuknutie",
            "hold": "Podržanie",
            "double_tap": "Dvojité ťuknutie",
            "swipe_left": "Potiahnutie doľava",
            "swipe_right": "Potiahnutie doprava"
        },
        "search_view_options": {
            "list": "Zoznam",
            "card": "Karta"
        }
    },
    "card": {
        "sections": {
            "details": "Detaily prehrávania",
            "menu": "Menu a vyhľadávanie",
            "action_chips": "Akčné čipy"
        },
        "media_controls": {
            "shuffle": "Náhodne",
            "previous": "Predchádzajúce",
            "play_pause": "Prehrať/Pozastaviť",
            "stop": "Zastaviť",
            "next": "Nasledujúce",
            "repeat": "Opakovať"
        },
        "menu": {
            "more_info": "Viac informácií",
            "search": "Hľadať",
            "source": "Zdroj",
            "transfer_queue": "Presunúť frontu",
            "group_players": "Zoskupiť prehrávače",
            "select_entity": "Vyberte entitu pre viac info",
            "transfer_to": "Presunúť frontu do",
            "no_players": "Žiadne iné prehrávače Music Assistant nie sú k dispozícii."
        },
        "grouping": {
            "title": "Zoskupiť prehrávače",
            "sync_volume": "Synchronizovať hlasitosť",
            "group_all": "Zoskupiť všetko",
            "ungroup_all": "Zrušiť zoskupenie všetkého",
            "unavailable": "Prehrávač je nedostupný",
            "no_players": "Žiadne iné prehrávače schopné zoskupenia nie sú k dispozícii.",
            "master": "Hlavný (Master)",
            "joined": "Pripojený",
            "available": "Dostupný",
            "current": "Aktuálny",
            "unjoin_from": "Odpojiť od {master}",
            "join_with": "Pripojiť k {master}"
        }
    },
    "search": {
        "favorites": "Obľúbené",
        "recently_played": "Nedávno prehrávané",
        "next_up": "Nasledujúce",
        "recommendations": "Odporúčania",
        "radio_mode": "Režim rádio",
        "close": "Zatvoriť vyhľadávanie",
        "no_results": "Žiadne výsledky.",
        "play_next": "Prehrať ako nasledujúce",
        "replace_play": "Nahradiť frontu a prehrať teraz",
        "replace": "Nahradiť frontu",
        "add_queue": "Pridať na koniec fronty",
        "move_up": "Posunúť nahor",
        "move_down": "Posunúť nadol",
        "move_next": "Presunúť na nasledujúce",
        "remove": "Odstrániť z fronty",
        "added": "Pridané do fronty!",
        "labels": {
            "replace": "Nahradiť",
            "next": "Nasledujúce",
            "replace_next": "Nahradiť nasledujúce",
            "add": "Pridať"
        },
        "results": "výsledkov",
        "result": "výsledok",
        "filters": {
            "all": "Všetko",
            "artist": "Interpret",
            "album": "Album",
            "track": "Skladba",
            "playlist": "Playlist",
            "radio": "Rádio",
            "music": "Hudba",
            "station": "Stanica",
            "podcast": "Podcast",
            "audiobook": "Audiokniha"
        },
        "search_artist": "Hľadať tohto interpreta"
    }
};
