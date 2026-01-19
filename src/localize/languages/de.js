export default {
    "common": {
        "not_found": "Entität nicht gefunden.",
        "search": "Suchen",
        "power": "Ein/Aus",
        "favorite": "Favorit",
        "loading": "Laden...",
        "no_results": "Keine Ergebnisse.",
        "close": "Schließen",
        "vol_up": "Lauter",
        "vol_down": "Leiser",
        "media_player": "Mediaplayer",
        "edit_entity": "Entitätseinstellungen bearbeiten",
        "edit_action": "Aktionseinstellungen bearbeiten",
        "mute": "Stumm",
        "unmute": "Stummschaltung aufheben",
        "seek": "Suchen",
        "volume": "Lautstärke",
        "play_now": "Jetzt abspielen",
        "more_options": "Weitere Optionen",
        "unavailable": "Nicht verfügbar",
        "back": "Zurück",
        "cancel": "Abbrechen",
        "reset_default": "Auf Standard zurücksetzen"
    },
    "editor": {
        "tabs": {
            "entities": "Entitäten",
            "behavior": "Verhalten",
            "look_and_feel": "Design",
            "artwork": "Artwork",
            "actions": "Aktionen"
        },
        "placeholders": {
            "search": "Musik suchen..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Allgemeine Einstellungen",
                    "description": "Globale Steuerung der Artwork-Anzeige und -Abrufung."
                },
                "idle": {
                    "title": "Artwork im Leerlauf",
                    "description": "Zeigt ein statisches Bild oder einen Entitäts-Schnappschuss an, wenn nichts abgespielt wird."
                },
                "overrides": {
                    "title": "Artwork-Überschreibungen",
                    "description": "Überschreibungen werden von oben nach unten ausgewertet. Zum Neusortieren ziehen."
                }
            },
            "entities": {
                "title": "Entitäten*",
                "description": "Fügen Sie die zu steuernden Mediaplayer hinzu. Entitäten ziehen, um sie neu anzuordnen."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Leerlauf & Chips",
                    "description": "Wählen Sie, wann die Karte in den Leerlauf wechselt und wie sich Entitäts-Chips verhalten."
                },
                "interactions_search": {
                    "title": "Interaktionen & Suche",
                    "description": "Feineinstellung des Anpinnens von Entitäten und der Anzahl der Suchergebnisse."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Theme & Layout",
                    "description": "Anpassung an das Dashboard-Styling und Kontrolle des Platzbedarfs."
                },
                "controls_typography": {
                    "title": "Steuerung & Typografie",
                    "description": "Anpassung von Schaltflächengröße, Entitäts-Labels und adaptivem Text."
                },
                "collapsed_idle": {
                    "title": "Eingeklappte & Leerlaufzustände",
                    "description": "Steuerung der Karteneinklappung und der Ansichten im Leerlauf."
                }
            },
            "actions": {
                "title": "Aktionen",
                "description": "Erstellen Sie Aktions-Chips für die Karte oder das Menü. Ziehen zum Sortieren, Stift zum Konfigurieren anklicken."
            }
        },
        "subtitles": {
            "idle_timeout": "Zeit in Millisekunden vor dem Wechsel in den Leerlaufmodus. 0 zum Deaktivieren.",
            "show_chip_row": "\"Auto\" blendet die Chip-Leiste bei nur einer Entität aus. \"Im Menü\" verschiebt sie ins Menü.",
            "dim_chips": "Entitäts- und Aktions-Chips im Leerlauf mit Bild abdunkeln für einen sauberen Look.",
            "hold_to_pin": "Langes Drücken statt kurzem Drücken zum Anpinnen, um automatisches Umschalten zu verhindern.",
            "disable_autofocus": "Suchfeld-Autofokus deaktivieren, damit Bildschirmtastaturen ausgeblendet bleiben.",
            "search_within_filter": "Innerhalb des aktiven Filters suchen (Favoriten, etc.), anstatt ihn zu löschen.",
            "close_search_on_play": "Suchbildschirm beim Abspielen automatisch schließen.",
            "pin_search_headers": "Sucheingabe und Filter beim Scrollen oben fixieren.",
            "disable_mass": "Optionale Mass Queue Integration deaktivieren, auch wenn sie installiert ist.",
            "swap_pause_stop": "Pause-Taste durch Stop-Taste im modernen Layout ersetzen.",
            "adaptive_controls": "Wiedergabetasten an verfügbaren Platz anpassen.",
            "hide_menu_player": "Entitäts-Label unten ausblenden, wenn Chips im Menü sind.",
            "adaptive_text": "Textgruppen wählen, die mit dem Platz skalieren (leer lassen zum Deaktivieren).",
            "collapse_expand": "Immer eingeklappt aktiviert den Mini-Player-Modus. Bei Suche ausklappen aktiviert ihn temporär.",
            "idle_screen": "Wählen Sie, welcher Bildschirm im Leerlauf automatisch angezeigt wird.",
            "hide_controls": "Wählen Sie Steuerelemente aus, die für diese Entität ausgeblendet werden sollen.",
            "hide_search_chips": "Bestimmte Suchfilter-Chips für diese Entität ausblenden.",
            "follow_active_entity": "Lautstärke-Entität folgt automatisch der aktiven Wiedergabe-Entität.",
            "search_limit_full": "Maximale Anzahl an Suchergebnissen (1-1000, Standard: 20).",
            "result_sorting_full": "Sortierung der Suchergebnisse wählen. Standard behält die Quellreihenfolge bei.",
            "card_height_full": "Leer lassen für automatische Höhe.",
            "control_layout_full": "Wählen Sie zwischen manuellem oder modernem Home Assistant Layout.",
            "artwork_extend": "Artwork-Hintergrund unter die Chip- und Aktionsleisten erweitern.",
            "artwork_extend_label": "Artwork erweitern",
            "no_artwork_overrides": "Keine Artwork-Überschreibungen konfiguriert.",
            "entity_current_hint": "'entity_id: current' verwenden, um den aktuell ausgewählten Mediaplayer anzusteuern.",
            "service_data_note": "Änderungen an den Servicedaten werden erst beim Klicken auf 'Servicedaten speichern' übernommen!",
            "jinja_template_hint": "Jinja-Template eingeben, das eine entity_id ergibt.",
            "jinja_template_vol_hint": "Jinja-Template eingeben, das eine Lautstärke-entity_id ergibt.",
            "not_available_alt_collapsed": "Nicht verfügbar mit alternativem Fortschrittsbalken oder im Modus 'Immer eingeklappt'.",
            "not_available_collapsed": "Nicht verfügbar, wenn 'Immer eingeklappt' aktiviert ist.",
            "only_available_collapsed": "Nur verfügbar, wenn 'Immer eingeklappt' aktiviert ist.",
            "only_available_modern": "Nur verfügbar im modernen Layout.",
            "image_url_helper": "Direkte Bild-URL oder lokalen Dateipfad eingeben.",
            "selected_entity_helper": "Input-Text-Helper, der mit der aktuell ausgewählten Mediaplayer-Entitäts-ID aktualisiert wird.",
            "sync_entity_type": "Wählen Sie, welche Entitäts-ID mit dem Helper synchronisiert werden soll (Standard: Music Assistant Entität, falls konfiguriert)."
        },
        "titles": {
            "edit_entity": "Entität bearbeiten",
            "edit_action": "Aktion bearbeiten",
            "service_data": "Servicedaten",
            "add_artwork_override": "Artwork-Überschreibung hinzufügen"
        },
        "labels": {
            "dim_chips": "Chips im Leerlauf abdunkeln",
            "hold_to_pin": "Gedrückt halten zum Anpinnen",
            "disable_autofocus": "Such-Autofocus deaktivieren",
            "keep_filters": "Filter bei Suche beibehalten",
            "dismiss_on_play": "Suche beim Abspielen beenden",
            "pin_headers": "Such-Header fixieren",
            "disable_mass": "Mass Queue deaktivieren",
            "match_theme": "Theme anpassen",
            "alt_progress": "Alternativer Fortschrittsbalken",
            "display_timestamps": "Zeitstempel anzeigen",
            "swap_pause_stop": "Pause durch Stop ersetzen",
            "adaptive_controls": "Adaptive Tastengröße",
            "hide_active_entity": "Aktives Entitäts-Label ausblenden",
            "collapse_on_idle": "Bei Leerlauf einklappen",
            "hide_menu_player_toggle": "Menü-Player ausblenden",
            "always_collapsed": "Immer eingeklappt",
            "expand_on_search": "Bei Suche ausklappen",
            "script_var": "Skript-Variable (yamp_entity)",
            "use_ma_template": "Template für Music Assistant Entität verwenden",
            "use_vol_template": "Template für Lautstärke-Entität verwenden",
            "follow_active_entity": "Lautstärke folgt aktiver Entität",
            "use_url_path": "URL oder Pfad verwenden",
            "adaptive_text_elements": "Elemente für adaptive Textgröße"
        },
        "fields": {
            "artwork_fit": "Artwork-Anpassung",
            "artwork_position": "Artwork-Position",
            "artwork_hostname": "Artwork-Hostname",
            "match_field": "Match-Feld",
            "match_value": "Match-Wert",
            "size_percent": "Größe (%)",
            "object_fit": "Object-Fit",
            "idle_timeout": "Leerlauf-Timeout (ms)",
            "show_chip_row": "Chip-Leiste anzeigen",
            "search_limit": "Suchlimit",
            "result_sorting": "Ergebnissortierung",
            "vol_step": "Lautstärke-Schritt (0.05 = 5%)",
            "card_height": "Kartenhöhe (px)",
            "control_layout": "Steuerungs-Layout",
            "save_service_data": "Servicedaten speichern",
            "image_url": "Bild-URL",
            "fallback_image_url": "Fallback Bild-URL",
            "move_to_main": "Aktion in Haupt-Chips verschieben",
            "move_to_menu": "Aktion ins Menü verschieben",
            "delete_action": "Aktion löschen",
            "revert_service_data": "Auf gespeicherte Servicedaten zurücksetzen",
            "test_action": "Aktion testen",
            "volume_mode": "Lautstärke-Modus",
            "idle_screen": "Leerlauf-Bildschirm",
            "name": "Name",
            "hidden_controls": "Ausgeblendete Steuerungen",
            "ma_template": "Music Assistant Entitäts-Template (Jinja)",
            "hidden_chips": "Ausgeblendete Suchfilter-Chips",
            "vol_template": "Lautstärke-Entitäts-Template (Jinja)",
            "icon": "Icon",
            "action_type": "Aktionstyp",
            "menu_item": "Menüpunkt",
            "nav_path": "Navigationspfad",
            "service": "Dienst",
            "service_data": "Servicedaten",
            "idle_image_entity": "Leerlauf-Bild-Entität",
            "match_entity": "Match-Entität",
            "ma_entity": "Music Assistant Entität",
            "vol_entity": "Lautstärke-Entität",
            "selected_entity_helper": "Ausgewählter Entitäts-Helper",
            "sync_entity_type": "Synchronisierungs-Entitätstyp"
        },
        "action_types": {
            "menu": "Kartenmenüpunkt öffnen",
            "service": "Dienst aufrufen",
            "navigate": "Navigieren",
            "sync_selected_entity": "Ausgewählte Entität synchronisieren"
        },
        "action_helpers": {
            "sync_selected_entity": "Entität synchronisieren →",
            "select_helper": "(Helper auswählen)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Music Assistant Entität, falls konfiguriert)",
            "yamp_main_entity": "yamp_main_entity (Haupt-Mediaplayer-Entität)",
            "yamp_playback_entity": "yamp_playback_entity (Aktuelle aktive Wiedergabe-Entität)"
        }
    },
    "card": {
        "sections": {
            "details": "Details zur Wiedergabe",
            "menu": "Menü & Suchblätter",
            "action_chips": "Aktions-Chips"
        },
        "media_controls": {
            "shuffle": "Zufall",
            "previous": "Zurück",
            "play_pause": "Play/Pause",
            "stop": "Stop",
            "next": "Weiter",
            "repeat": "Wiederholen"
        },
        "menu": {
            "more_info": "Mehr Info",
            "search": "Suche",
            "source": "Quelle",
            "transfer_queue": "Warteschlange übertragen",
            "group_players": "Player gruppieren",
            "select_entity": "Entität für mehr Info wählen",
            "transfer_to": "Warteschlange übertragen zu",
            "no_players": "Keine anderen Music Assistant Player verfügbar."
        },
        "grouping": {
            "title": "Player gruppieren",
            "sync_volume": "Lautstärke synchronisieren",
            "group_all": "Alle gruppieren",
            "ungroup_all": "Alle trennen",
            "unavailable": "Player ist nicht verfügbar",
            "no_players": "Keine anderen gruppierungsfähigen Player verfügbar.",
            "master": "Master",
            "joined": "Verbunden",
            "available": "Verfügbar",
            "current": "Aktuell"
        }
    },
    "search": {
        "favorites": "Favoriten",
        "recently_played": "Zuletzt gehört",
        "next_up": "Als Nächstes",
        "recommendations": "Empfehlungen",
        "radio_mode": "Radiomodus",
        "close": "Suche schließen",
        "no_results": "Keine Ergebnisse.",
        "play_next": "Als Nächstes spielen",
        "replace_play": "Warteschlange ersetzen und jetzt spielen",
        "replace": "Warteschlange ersetzen",
        "add_queue": "Am Ende der Warteschlange hinzufügen",
        "move_up": "Nach oben",
        "move_down": "Nach unten",
        "move_next": "Als Nächstes verschieben",
        "remove": "Aus Warteschlange entfernen",
        "added": "Zur Warteschlange hinzugefügt!",
        "labels": {
            "replace": "Ersetzen",
            "next": "Weiter",
            "replace_next": "Weiter ersetzen",
            "add": "Hinzufügen"
        },
        "results": "Ergebnisse",
        "result": "Ergebnis",
        "filters": {
            "all": "Alle",
            "artist": "Künstler",
            "album": "Album",
            "track": "Titel",
            "playlist": "Playlist",
            "radio": "Radio",
            "music": "Musik",
            "station": "Station",
            "podcast": "Podcast"
        },
        "search_artist": "Nach diesem Künstler suchen"
    }
};
