export default {
    "common": {
        "not_found": "Entiteta ni najdena.",
        "search": "Išči",
        "power": "Napajanje",
        "favorite": "Priljubljeno",
        "loading": "Nalaganje...",
        "no_results": "Ni rezultatov.",
        "close": "Zapri",
        "vol_up": "Povečaj glasnost",
        "vol_down": "Zmanjšaj glasnost",
        "media_player": "Predvajalnik predstavnosti",
        "edit_entity": "Uredi nastavitve entitete",
        "edit_action": "Uredi nastavitve dejanja",
        "mute": "Utišaj",
        "unmute": "Vklopi zvok",
        "seek": "Previj",
        "volume": "Glasnost",
        "play_now": "Predvajaj zdaj",
        "more_options": "Več možnosti",
        "unavailable": "Ni na voljo",
        "back": "Nazaj",
        "cancel": "Prekliči",
        "reset_default": "Ponastavi na privzeto"
    },
    "editor": {
        "tabs": {
            "entities": "Entitete",
            "behavior": "Vedenje",
            "look_and_feel": "Videz in občutek",
            "artwork": "Grafika",
            "actions": "Dejanja"
        },
        "placeholders": {
            "search": "Išči glasbo..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Splošne nastavitve",
                    "description": "Globalni nadzor nad prikazom in pridobivanjem grafike."
                },
                "idle": {
                    "title": "Grafika v mirovanju",
                    "description": "Prikaži statično sliko ali posnetek entitete, ko se nič ne predvaja."
                },
                "overrides": {
                    "title": "Prepis grafike",
                    "description": "Prepisi se ocenjujejo od zgoraj navzdol. Povlecite za spremembo vrstnega reda."
                }
            },
            "entities": {
                "title": "Entitete*",
                "description": "Dodajte predvajalnike, ki jih želite upravljati. Povlecite entitete za spremembo vrstnega reda."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Mirovanje in čipi",
                    "description": "Izberite, kdaj kartica preide v mirovanje in kako se obnašajo čipi entitet."
                },
                "interactions_search": {
                    "title": "Interakcije in iskanje",
                    "description": "Nastavite pripenjanje entitet in število prikazanih rezultatov."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Tema in postavitev",
                    "description": "Ujemanje s slogom nadzorne plošče in nadzor velikosti."
                },
                "controls_typography": {
                    "title": "Kontrolniki in tipografija",
                    "description": "Prilagodite velikost gumbov, oznake entitet in prilagodljivo besedilo."
                },
                "collapsed_idle": {
                    "title": "Strnjeno in mirovanje",
                    "description": "Nadzorujte, kdaj se kartica skrči in kaj se prikaže v mirovanju."
                }
            },
            "actions": {
                "title": "Dejanja",
                "description": "Ustvarite čipe dejanj, ki se prikažejo na kartici ali v meniju."
            }
        },
        "subtitles": {
            "idle_timeout": "Čas v milisekundah, preden kartica preide v mirovanje. Nastavite na 0 za izklop.",
            "show_chip_row": "\"Samodejno\" skrije čipe, če je nastavljena ena entiteta. \"V meniju\" jih premakne v meni. \"V meniju med nedejavnostjo\" prikaže čipe v vrstici, ko je aktivna, a jih premakne v meni med nedejavnostjo.",
            "dim_chips": "Ko kartica preide v mirovanje s sliko, se čipi zatemnijo.",
            "hold_to_pin": "Dolgi pritisk za pripenjanje entitet namesto kratkega.",
            "always_show_group": "Kontrolni elementi za hitro združevanje (+/-/zvezda) bodo privzeto vidni ob nalaganju strani. Še vedno jih lahko ročno preklopite z dvojnim tapom.",
            "disable_autofocus": "Prepreči samodejni fokus iskalnega polja.",
            "search_within_filter": "Išči znotraj trenutnega filtra.",
            "close_search_on_play": "Samodejno zapri iskanje ob predvajanju.",
            "pin_search_headers": "Pripni iskalno polje in filtre na vrh.",
            "hide_search_headers_on_idle": "Skrij iskalno polje in filtre med mirovanjem.",
            "disable_mass": "Onemogoči integracijo Mass Queue.",
            "swap_pause_stop": "Zamenjaj gumb pavze z gumbom zaustavitve med uporabo moderne postavitve.",
            "adaptive_controls": "Prilagodi velikost gumbov glede na prostor.",
            "hide_menu_player": "Skrij oznako entitete v meniju.",
            "adaptive_text": "Izberi skupine besedila za prilagajanje velikosti.",
            "collapse_expand": "Vedno skrčeno ustvari mini predvajalnik.",
            "idle_screen": "Izberi zaslon, prikazan v mirovanju.",
            "hide_controls": "Izberi kontrolnike za skrivanje.",
            "hide_search_chips": "Skrij določene iskalne filtre.",
            "follow_active_entity": "Entiteta glasnosti sledi aktivni entiteti. Opomba: To prepiše izbrano entiteto za glasnost.",
            "search_limit_full": "Največje število rezultatov (1–1000, privzeto: 20).",
            "default_search_filter_full": "Izberite, kateri filter je privzeto aktiven ob odprtju iskanja.",
            "default_search_favorites": "Začni iskanje z aktivnimi priljubljenimi",
            "result_sorting_full": "Izberi razvrščanje rezultatov.",
            "card_height_full": "Pustite prazno za samodejno višino.",
            "control_layout_full": "Izberi med staro in moderno postavitvijo.",
            "artwork_extend": "Razširi ozadje grafike pod čipe.",
            "artwork_extend_label": "Razširi grafiko",
            "no_artwork_overrides": "Ni nastavljenih prepisov grafike.",
            "entity_current_hint": "Uporabi entity_id: current za trenutno izbrano entiteto.",
            "service_data_note": "Spremembe se shranijo šele ob kliku na ikono shrani.",
            "jinja_template_hint": "Vnesite Jinja predlogo, ki vrne en entity_id.",
            "jinja_template_vol_hint": "Vnesite Jinja predlogo za entiteto glasnosti.",
            "not_available_alt_collapsed": "Ni na voljo z alternativno vrstico napredka.",
            "not_available_collapsed": "Ni na voljo v vedno skrčenem načinu.",
            "only_available_collapsed": "Na voljo le v vedno skrčenem načinu.",
            "only_available_modern": "Na voljo le v moderni postavitvi.",
            "image_url_helper": "Vnesite neposredni URL do slike ali lokalno pot do datoteke",
            "selected_entity_helper": "Pomočnik za vnos besedila, ki bo posodobljen z ID-jem trenutno izbranega predvajalnika medijev.",
            "sync_entity_type": "Izberite, kateri ID entitete želite sinhronizirati s pomočnikom (privzeto entiteto Music Assistant, če je nastavljena).",
            "disable_auto_select": "Prepreči samodejno izbiro čipa te entitete ob začetku predvajanja.",
            "search_view": "Izberite med standardnim seznamom ali mrežo kartic za rezultate iskanja.",
            "search_card_columns": "Določite število stolpcev v pogledu kartic. Grafika se bo samodejno prilagodila."
        },
        "titles": {
            "edit_entity": "Uredi entiteto",
            "edit_action": "Uredi dejanje",
            "service_data": "Podatki storitve",
            "add_artwork_override": "Dodaj prepis grafike"
        },
        "labels": {
            "dim_chips": "Zatemni čipe v mirovanju",
            "hold_to_pin": "Drži za pripenjanje",
            "always_show_group": "Hitro združevanje kot privzeto",
            "disable_autofocus": "Onemogoči samodejni fokus",
            "keep_filters": "Ohrani filtre",
            "dismiss_on_play": "Zapri iskanje ob predvajanju",
            "default_search_filter": "Privzeti iskalni filter",
            "default_search_favorites": "Privzeti filter priljubljenih",
            "pin_headers": "Pripni glave iskanja",
            "hide_search_headers_on_idle": "Skrij glave iskanja med mirovanjem",
            "disable_mass": "Onemogoči Mass Queue",
            "match_theme": "Ujemaj temo",
            "alt_progress": "Alternativna vrstica napredka",
            "display_timestamps": "Prikaži časovne oznake",
            "swap_pause_stop": "Zamenjaj pavzo z zaustavitvijo",
            "adaptive_controls": "Prilagodljiva velikost gumbov",
            "hide_active_entity": "Skrij oznako aktivne entitete",
            "collapse_on_idle": "Skrči v mirovanju",
            "hide_menu_player_toggle": "Skrij predvajalnik v meniju",
            "always_collapsed": "Vedno skrčeno",
            "expand_on_search": "Razširi ob iskanju",
            "script_var": "Skriptna spremenljivka",
            "use_ma_template": "Uporabi predlogo za entiteto Music Assistant",
            "use_vol_template": "Uporabi predlogo za glasnost",
            "follow_active_entity": "Glasnost sledi aktivni entiteti",
            "use_url_path": "Uporabi URL ali pot",
            "adaptive_text_elements": "Elementi prilagodljive velikosti besedila",
            "disable_auto_select": "Onemogoči samodejno izbiro"
        },
        "fields": {
            "artwork_fit": "Prileganje grafike",
            "artwork_position": "Položaj grafike",
            "artwork_hostname": "Ime gostitelja grafike",
            "match_field": "Polje ujemanja",
            "match_value": "Vrednost ujemanja",
            "size_percent": "Velikost (%)",
            "object_fit": "Prileganje objekta",
            "idle_timeout": "Čas mirovanja (ms)",
            "show_chip_row": "Prikaži vrstico čipov",
            "search_limit": "Omejitev rezultatov iskanja",
            "result_sorting": "Razvrščanje rezultatov",
            "vol_step": "Korak glasnosti (0.05 = 5 %)",
            "card_height": "Višina kartice (px)",
            "control_layout": "Postavitev kontrolnikov",
            "save_service_data": "Shrani podatke storitve",
            "image_url": "URL slike",
            "fallback_image_url": "Rezervni URL slike",
            "move_to_main": "Premakni dejanje na glavno vrstico",
            "move_to_menu": "Premakni dejanje v meni",
            "delete_action": "Izbriši dejanje",
            "revert_service_data": "Povrni shranjene podatke",
            "test_action": "Preizkusi dejanje",
            "volume_mode": "Način glasnosti",
            "idle_screen": "Zaslon v mirovanju",
            "name": "Ime",
            "hidden_controls": "Skriti kontrolniki",
            "ma_template": "Predloga Music Assistant (Jinja)",
            "hidden_chips": "Skriti iskalni čipi",
            "vol_template": "Predloga entitete glasnosti (Jinja)",
            "icon": "Ikona",
            "action_type": "Vrsta dejanja",
            "menu_item": "Element menija",
            "nav_path": "Navigacijska pot",
            "service": "Storitev",
            "service_data": "Podatki storitve",
            "idle_image_entity": "Entiteta slike v mirovanju",
            "match_entity": "Ujemajoča entiteta",
            "ma_entity": "Entiteta Music Assistant",
            "vol_entity": "Entiteta glasnosti",
            "selected_entity_helper": "Pomočnik izbrane entitete",
            "sync_entity_type": "Vrsta entitete za sinhronizacijo",
            "placement": "Namestitev",
            "card_trigger": "Sprožilec kartice",
            "search_view": "Pogled rezultatov iskanja",
            "search_card_columns": "Stolpci kartic"
        },
        "action_types": {
            "menu": "Odpri element menija kartice",
            "service": "Pokliči storitev",
             "navigate": "Navigiraj",
            "prev_entity": "Previous Entity Chip",
            "next_entity": "Next Entity Chip",
            "sync_selected_entity": "Sinhroniziraj izbrano entiteto"
        },
        "action_helpers": {
            "sync_selected_entity": "Sinhroniziraj izbrano entiteto →",
            "select_helper": "(izberite pomočnika)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (entiteta Music Assistant, če je nastavljena)",
            "yamp_main_entity": "yamp_main_entity (glavna entiteta predvajalnika medijev)",
            "yamp_playback_entity": "yamp_playback_entity (trenutno aktivna entitea predvajanja)"
        },
        "placements": {
            "chip": "Čip dejanja",
            "menu": "V meniju",
            "hidden": "Skrito (dotik grafike)",
            "not_triggerable": "Ni mogoče sprožiti"
        },
        "triggers": {
            "none": "Brez",
            "tap": "Dotik",
            "hold": "Pridržanje",
            "double_tap": "Dvojni dotik",
            "swipe_left": "Podrsaj levo",
            "swipe_right": "Podrsaj desno"
        },
        "search_view_options": {
            "list": "Seznam",
            "card": "Kartica"
        }
    },
    "card": {
        "sections": {
            "details": "Podrobnosti predvajanja",
            "menu": "Meni in iskanje",
            "action_chips": "Čipi dejanj"
        },
        "media_controls": {
            "shuffle": "Naključno",
            "previous": "Prejšnje",
            "play_pause": "Predvajaj/Pavza",
            "stop": "Ustavi",
            "next": "Naslednje",
            "repeat": "Ponovi"
        },
        "menu": {
            "more_info": "Več informacij",
            "search": "Išči",
            "source": "Vir",
            "transfer_queue": "Prenesi čakalno vrsto",
            "group_players": "Združi predvajalnike",
            "select_entity": "Izberi entiteto za več informacij",
            "transfer_to": "Prenesi čakalno vrsto na",
            "no_players": "Ni drugih razpoložljivih predvajalnikov Music Assistant."
        },
        "grouping": {
            "title": "Združi predvajalnike",
            "sync_volume": "Sinhroniziraj glasnost",
            "group_all": "Združi vse",
            "ungroup_all": "Razdruži vse",
            "unavailable": "Predvajalnik ni na voljo",
            "no_players": "Ni drugih predvajalnikov za združevanje.",
            "master": "Glavni",
            "joined": "Pridružen",
            "available": "Na voljo",
            "current": "Trenutni",
            "unjoin_from": "Odslopi od {master}",
            "join_with": "Pridruži se {master}"
        }
    },
    "search": {
        "favorites": "Priljubljeni",
        "recently_played": "Nedavno predvajano",
        "next_up": "Naslednje",
        "recommendations": "Priporočila",
        "radio_mode": "Radijski način",
        "close": "Zapri iskanje",
        "no_results": "Ni rezultatov.",
        "play_next": "Predvajaj naslednje",
        "replace_play": "Zamenjaj čakalno vrsto in predvajaj",
        "replace": "Zamenjaj čakalno vrsto",
        "add_queue": "Dodaj na konec čakalne vrste",
        "move_up": "Premakni gor",
        "move_down": "Premakni dol",
        "move_next": "Premakni na naslednje",
        "remove": "Odstrani iz čakalne vrste",
        "added": "Dodano v čakalno vrsto!",
        "labels": {
            "replace": "Zamenjaj",
            "next": "Naslednje",
            "replace_next": "Zamenjaj naslednje",
            "add": "Dodaj"
        },
        "results": "rezultati",
        "result": "rezultat",
        "filters": {
            "all": "Vse",
            "artist": "Izvajalec",
            "album": "Album",
            "track": "Skladba",
            "playlist": "Seznam predvajanja",
            "radio": "Radio",
            "music": "Glasba",
            "station": "Postaja",
            "podcast": "Podcast",
            "audiobook": "Zvočna knjiga"
        },
        "search_artist": "Išči tega izvajalca"
    }
};
