export default {
    "common": {
        "not_found": "Entiteit niet gevonden.",
        "search": "Zoeken",
        "power": "Aan/Uit",
        "favorite": "Favoriet",
        "loading": "Laden...",
        "no_results": "Geen resultaten.",
        "close": "Sluiten",
        "vol_up": "Volume Omhoog",
        "vol_down": "Volume Omlaag",
        "media_player": "Mediaspeler",
        "edit_entity": "Entiteitsinstellingen Bewerken",
        "edit_action": "Actie-instellingen Bewerken",
        "mute": "Dempen",
        "unmute": "Dempen opheffen",
        "seek": "Zoeken",
        "volume": "Volume",
        "play_now": "Nu Spelen",
        "more_options": "Meer Opties",
        "unavailable": "Niet beschikbaar",
        "back": "Terug",
        "cancel": "Annuleren",
        "reset_default": "Herstellen naar standaard"
    },
    "editor": {
        "tabs": {
            "entities": "Entiteiten",
            "behavior": "Gedrag",
            "look_and_feel": "Uiterlijk",
            "artwork": "Artwork",
            "actions": "Acties"
        },
        "placeholders": {
            "search": "Zoek muziek..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Algemene Instellingen",
                    "description": "Globale instellingen voor hoe artwork wordt weergegeven en opgehaald."
                },
                "idle": {
                    "title": "Artwork bij Inactiviteit",
                    "description": "Toon een statische afbeelding of entiteits-snapshot wanneer er niets wordt afgespeeld."
                },
                "overrides": {
                    "title": "Artwork Overschrijvingen",
                    "description": "Overschrijvingen worden van boven naar beneden geëvalueerd. Sleep om te sorteren."
                }
            },
            "entities": {
                "title": "Entiteiten*",
                "description": "Voeg de mediaspelers toe die je wilt bedienen. Sleep entiteiten om de volgorde te wijzigen."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Inactiviteit & Chips",
                    "description": "Kies wanneer de kaart inactief wordt en hoe entiteitschips zich gedragen."
                },
                "interactions_search": {
                    "title": "Interacties & Zoeken",
                    "description": "Verfijn hoe entiteiten worden vastgezet en hoeveel resultaten er tegelijk worden getoond."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Thema & Layout",
                    "description": "Stem af op de styling van het dashboard en beheer de totale voetafdruk."
                },
                "controls_typography": {
                    "title": "Bediening & Typografie",
                    "description": "Pas knopgrootte, entiteitslabels en adaptieve tekst aan."
                },
                "collapsed_idle": {
                    "title": "Ingeklapte & Inactieve Staten",
                    "description": "Beheer wanneer de kaart inklapt en welke weergaven getoond worden bij inactiviteit."
                }
            },
            "actions": {
                "title": "Acties",
                "description": "Bouw de actiechips die in de kaart of het menu verschijnen. Sleep om te sorteren, klik op het potlood om te configureren."
            }
        },
        "subtitles": {
            "idle_timeout": "Tijd in milliseconden voordat de kaart naar de inactieve modus gaat. Stel in op 0 om inactiviteitsgedrag uit te schakelen.",
            "show_chip_row": "\"Auto\" verbergt de chiprij wanneer er slechts één entiteit is geconfigureerd. \"In Menu\" verplaatst de chips naar het menu-overlay. \"In menu bij inactiviteit\" toont chips inline wanneer actief maar verplaatst ze naar het menu wanneer inactief.",
            "dim_chips": "Wanneer de kaart inactief wordt met een afbeelding, dim dan de entiteits- en actiechips voor een strakker uiterlijk.",
            "hold_to_pin": "Houd entiteitschips lang ingedrukt in plaats van kort om ze vast te zetten, om automatisch schakelen tijdens afspelen te voorkomen.",
            "always_show_group": "Snelgroeperingsknoppen (+/-/ster) zijn standaard zichtbaar bij het laden van de pagina. Je kunt ze nog steeds handmatig in- of uitschakelen via dubbeltikken.",
            "disable_autofocus": "Voorkom dat het zoekveld de focus steelt, zodat onscreen toetsenborden verborgen blijven.",
            "search_within_filter": "Schakel dit in om te zoeken binnen het huidige actieve filter (Favorieten, Recent Afgespeeld, etc) in plaats van dit te wissen.",
            "close_search_on_play": "Sluit het zoekscherm automatisch wanneer een nummer wordt afgespeeld.",
            "pin_search_headers": "Houd de zoekinvoer en filters bovenaan vast tijdens het scrollen door resultaten.",
            "hide_search_headers_on_idle": "Verberg zoekinvoer en filters wanneer inactief.",
            "disable_mass": "Schakel de optionele Mass Queue integratie uit, zelfs als deze is geïnstalleerd.",
            "swap_pause_stop": "Vervang de pauzeknop door stop bij gebruik van de moderne lay-out.",
            "adaptive_controls": "Laat de afspeelknoppen groeien of krimpen om in de beschikbare ruimte te passen.",
            "hide_menu_player": "Wanneer chips in het menu staan, verberg dan het entiteitslabel onderaan de kaart.",
            "adaptive_text": "Kies welke tekstgroepen moeten schalen met de beschikbare ruimte (laat leeg om adaptieve tekst uit te schakelen).",
            "collapse_expand": "Altijd Ingeklapt creëert de mini-spelermodus. Uitklappen bij Zoeken klapt tijdelijk uit tijdens het zoeken.",
            "idle_screen": "Kies welk scherm automatisch wordt weergegeven wanneer de kaart inactief wordt.",
            "hide_controls": "Selecteer welke knoppen je wilt verbergen voor deze entiteit (standaard worden ze allemaal getoond)",
            "hide_search_chips": "Verberg specifieke zoekfilterchips voor deze entiteit",
            "follow_active_entity": "Indien ingeschakeld, zal de volume-entiteit automatisch de actieve afspeel-entiteit volgen. Let op: dit overschrijft de geselecteerde volume-entiteit.",
            "search_limit_full": "Maximaal aantal zoekresultaten om weer te geven (1-1000, standaard: 20)",
            "default_search_filter_full": "Kies welk filter standaard actief is wanneer het zoekscherm wordt geopend.",
            "default_search_favorites": "Start zoekopdracht met favorieten actief",
            "result_sorting_full": "Kies hoe zoekresultaten worden gesorteerd. Standaard behoudt de bronvolgorde.",
            "card_height_full": "Laat leeg voor automatische hoogte",
            "control_layout_full": "Kies tussen de oude gelijkmatig verdeelde knoppen of de moderne Home Assistant lay-out.",
            "artwork_extend": "Laat de artwork-achtergrond doorlopen onder de chip- en actierijen.",
            "artwork_extend_label": "Artwork uitbreiden",
            "no_artwork_overrides": "Geen artwork overschrijvingen geconfigureerd. Gebruik de plusknop hieronder om er een toe te voegen.",
            "entity_current_hint": "Gebruik 'entity_id: current' om de momenteel geselecteerde mediaspeler op de kaart te targeten. Let op: de 'Test Actie' knop wordt uitgeschakeld bij gebruik van deze functie.",
            "service_data_note": "Wijzigingen in de servicegegevens hieronder worden pas in de configuratie opgeslagen nadat op de knop 'Servicegegevens Opslaan' is geklikt!",
            "jinja_template_hint": "Voer een Jinja-sjabloon in dat resulteert in een enkele entity_id. Voorbeeld voor het wisselen van MA op basis van een bronselectie:",
            "jinja_template_vol_hint": "Voer een Jinja-sjabloon in dat resulteert in een entity_id (bijv. media_player.kantoor). Voorbeeld voor het wisselen van volume-entiteit op basis van een boolean:",
            "not_available_alt_collapsed": "Niet beschikbaar met Alternatieve Voortgangsbalk of Altijd Ingeklapte modus",
            "not_available_collapsed": "Niet beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",
            "only_available_collapsed": "Alleen beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",
            "only_available_modern": "Alleen beschikbaar met de Moderne lay-out",
            "image_url_helper": "Voer een directe URL naar een afbeelding of een lokaal bestandspad in",
            "selected_entity_helper": "Invoerteksthelper die wordt bijgewerkt met de momenteel geselecteerde media player-entiteits-ID.",
            "sync_entity_type": "Kies welk entiteits-ID moet worden gesynchroniseerd met de helper (standaard Music Assistant-entiteit indien geconfigureerd).",
            "disable_auto_select": "Voorkomt dat de chip van deze entiteit automatisch wordt geselecteerd wanneer deze begint af te spelen.",
            "search_view": "Kies tussen een standaardlijst of een raster van kaarten voor zoekresultaten.",
            "search_card_columns": "Geef aan hoeveel kolommen er gebruikt moeten worden in de kaartweergave. De afbeelding wordt automatisch aangepast."
        },
        "titles": {
            "edit_entity": "Entiteit Bewerken",
            "edit_action": "Actie Bewerken",
            "service_data": "Servicegegevens",
            "add_artwork_override": "Artwork Overschrijving Toevoegen"
        },
        "labels": {
            "dim_chips": "Chips dimmen bij inactiviteit",
            "hold_to_pin": "Ingedrukt houden om vast te zetten",
            "always_show_group": "Snelgroepering standaard aan",
            "disable_autofocus": "Zoek-autofocus uitschakelen",
            "keep_filters": "Filters behouden bij zoeken",
            "dismiss_on_play": "Zoeken sluiten bij afspelen",
            "default_search_filter": "Standaard zoekfilter",
            "default_search_favorites": "Default to Favorites Filter",
            "pin_headers": "Zoekkoppen vastzetten",
            "hide_search_headers_on_idle": "Zoekkoppen verbergen bij inactiviteit",
            "disable_mass": "Mass Queue uitschakelen",
            "match_theme": "Thema matchen",
            "alt_progress": "Alternatieve Voortgangsbalk",
            "display_timestamps": "Tijdstempels Weergeven",
            "swap_pause_stop": "Pauze vervangen door Stop",
            "adaptive_controls": "Adaptieve Knoppen Grootte",
            "hide_active_entity": "Label van Actieve Entiteit verbergen",
            "collapse_on_idle": "Inklappen bij inactiviteit",
            "hide_menu_player_toggle": "Menu-speler Verbergen",
            "always_collapsed": "Altijd Ingeklapt",
            "expand_on_search": "Uitklappen bij Zoeken",
            "script_var": "Script Variabele (yamp_entity)",
            "use_ma_template": "Sjabloon gebruiken voor Music Assistant Entiteit",
            "use_vol_template": "Sjabloon gebruiken voor Volume Entiteit",
            "follow_active_entity": "Volume Entiteit volgt Actieve Entiteit",
            "use_url_path": "URL of Pad gebruiken",
            "adaptive_text_elements": "Elementen voor Adaptieve Tekstgrootte",
            "disable_auto_select": "Auto-selectie uitschakelen"
        },
        "fields": {
            "artwork_fit": "Artwork Passend Maken",
            "artwork_position": "Artwork Positie",
            "artwork_hostname": "Artwork Hostnaam",
            "match_field": "Match Veld",
            "match_value": "Match Waarde",
            "size_percent": "Grootte (%)",
            "object_fit": "Object Fit",
            "idle_timeout": "Time-out voor Inactiviteit (ms)",
            "show_chip_row": "Chiprij Tonen",
            "search_limit": "Limiet Zoekresultaten",
            "result_sorting": "Sortering Resultaten",
            "vol_step": "Volume Stap (0.05 = 5%)",
            "card_height": "Kaarthoogte (px)",
            "control_layout": "Knoppen Lay-out",
            "save_service_data": "Servicegegevens Opslaan",
            "image_url": "Afbeelding URL",
            "fallback_image_url": "Fallback Afbeelding URL",
            "move_to_main": "Verplaats actie naar hoofdchips",
            "move_to_menu": "Verplaats actie naar menu",
            "delete_action": "Actie Verwijderen",
            "revert_service_data": "Terugzetten naar Opgeslagen Gegevens",
            "test_action": "Actie Testen",
            "volume_mode": "Volume Modus",
            "idle_screen": "Inactief Scherm",
            "name": "Naam",
            "hidden_controls": "Verborgen Knoppen",
            "ma_template": "Music Assistant Entiteit Sjabloon (Jinja)",
            "hidden_chips": "Verborgen Zoekfilterchips",
            "vol_template": "Volume Entiteit Sjabloon (Jinja)",
            "icon": "Icoon",
            "action_type": "Actietype",
            "menu_item": "Menu-item",
            "nav_path": "Navigatiepad",
            "service": "Service",
            "service_data": "Servicegegevens",
            "idle_image_entity": "Entiteit voor inactieve afbeelding",
            "match_entity": "Match Entiteit",
            "ma_entity": "Music Assistant-entiteit",
            "vol_entity": "Volume-entiteit",
            "selected_entity_helper": "Geselecteerde entiteitshelper",
            "sync_entity_type": "Synchronisatie entiteitstype",
            "placement": "Plaatsing",
            "card_trigger": "Kaart trigger",
            "search_view": "Zoekresultaten weergave",
            "search_card_columns": "Kaart kolommen"
        },
        "action_types": {
            "menu": "Open een kaartmenu-item",
            "service": "Roep een service aan",
            "navigate": "Navigeren",
            "sync_selected_entity": "Synchroniseer geselecteerde entiteit"
        },
        "action_helpers": {
            "sync_selected_entity": "Geselecteerde entiteit synchroniseren →",
            "select_helper": "(selecteer helper)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Music Assistant-entiteit indien geconfigureerd)",
            "yamp_main_entity": "yamp_main_entity (Hoofd media player-entiteit)",
            "yamp_playback_entity": "yamp_playback_entity (Huidige actieve afspeelentiteit)"
        },
        "placements": {
            "chip": "Actiechip",
            "menu": "In menu",
            "hidden": "Verborgen (Artwork-tik)",
            "not_triggerable": "Niet triggerbaar"
        },
        "triggers": {
            "none": "Geen",
            "tap": "Tik",
            "hold": "Vasthouden",
            "double_tap": "Dubbeltik",
            "swipe_left": "Veeg naar links",
            "swipe_right": "Veeg naar rechts"
        },
        "search_view_options": {
            "list": "Lijst",
            "card": "Kaart"
        }
    },
    "card": {
        "sections": {
            "details": "Details van 'Nu Spelen'",
            "menu": "Menu & Zoekschermen",
            "action_chips": "Actie Chips"
        },
        "media_controls": {
            "shuffle": "Shuffle",
            "previous": "Vorige",
            "play_pause": "Afspelen/Pauzeren",
            "stop": "Stop",
            "next": "Volgende",
            "repeat": "Herhalen"
        },
        "menu": {
            "more_info": "Meer Info",
            "search": "Zoeken",
            "source": "Bron",
            "transfer_queue": "Wachtrij Overdragen",
            "group_players": "Spelers Groeperen",
            "select_entity": "Selecteer Entiteit voor Meer Info",
            "transfer_to": "Wachtrij Overdragen Naar",
            "no_players": "Geen andere Music Assistant spelers beschikbaar."
        },
        "grouping": {
            "title": "Spelers Groeperen",
            "sync_volume": "Volume Synchroniseren",
            "group_all": "Alles Groeperen",
            "ungroup_all": "Alles Loskoppelen",
            "unavailable": "Speler is niet beschikbaar",
            "no_players": "Geen andere spelers beschikbaar die kunnen groeperen.",
            "master": "Master",
            "joined": "Gekoppeld",
            "available": "Beschikbaar",
            "current": "Huidig",
            "unjoin_from": "Loskoppelen van {master}",
            "join_with": "Koppelen met {master}"
        }
    },
    "search": {
        "favorites": "Favorieten",
        "recently_played": "Recent Afgespeeld",
        "next_up": "Volgende",
        "recommendations": "Aanbevelingen",
        "radio_mode": "Radiomodus",
        "close": "Zoeken Sluiten",
        "no_results": "Geen resultaten.",
        "play_next": "Volgende afspelen",
        "replace_play": "Huidige wachtrij vervangen en nu afspelen",
        "replace": "Wachtrij vervangen",
        "add_queue": "Toevoegen aan einde van de wachtrij",
        "move_up": "Omhoog verplaatsen",
        "move_down": "Omlaag verplaatsen",
        "move_next": "Als volgende afspelen",
        "remove": "Verwijderen uit wachtrij",
        "added": "Toegevoegd aan wachtrij!",
        "labels": {
            "replace": "Vervangen",
            "next": "Volgende",
            "replace_next": "Vervang Volgende",
            "add": "Toevoegen"
        },
        "results": "resultaten",
        "result": "resultaat",
        "filters": {
            "all": "Alles",
            "artist": "Artiest",
            "album": "Album",
            "track": "Nummer",
            "playlist": "Afspeellijst",
            "radio": "Radio",
            "music": "Muziek",
            "station": "Zender",
            "podcast": "Podcast",
            "audiobook": "Luisterboek"
        },
        "search_artist": "Zoek naar deze artiest"
    }
};
