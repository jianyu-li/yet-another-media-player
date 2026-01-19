export default {
    "common": {
        "not_found": "Entité non trouvée.",
        "search": "Rechercher",
        "power": "Alimentation",
        "favorite": "Favori",
        "loading": "Chargement...",
        "no_results": "Aucun résultat.",
        "close": "Fermer",
        "vol_up": "Monter le volume",
        "vol_down": "Baisser le volume",
        "media_player": "Lecteur Multimédia",
        "edit_entity": "Modifier les paramètres de l'entité",
        "edit_action": "Modifier les paramètres de l'action",
        "mute": "Muet",
        "unmute": "Rétablir le son",
        "seek": "Rechercher",
        "volume": "Volume",
        "play_now": "Lire maintenant",
        "more_options": "Plus d'options",
        "unavailable": "Indisponible",
        "back": "Retour",
        "cancel": "Annuler",
        "reset_default": "Réinitialiser"
    },
    "editor": {
        "tabs": {
            "entities": "Entités",
            "behavior": "Comportement",
            "look_and_feel": "Apparence",
            "artwork": "Illustrations",
            "actions": "Actions"
        },
        "placeholders": {
            "search": "Rechercher de la musique..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Paramètres Généraux",
                    "description": "Contrôles globaux pour l'affichage des illustrations."
                },
                "idle": {
                    "title": "Illustration au Repos",
                    "description": "Afficher une image statique lorsque rien n'est en lecture."
                },
                "overrides": {
                    "title": "Remplacements d'Illustrations",
                    "description": "Les remplacements sont évalués de haut en bas. Glissez pour réordonner."
                }
            },
            "entities": {
                "title": "Entités*",
                "description": "Ajoutez les lecteurs multimédias que vous souhaitez contrôler. Glissez pour réordonner."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Veille & Jetons",
                    "description": "Choisissez quand la carte passe en mode veille et comment les jetons se comportent."
                },
                "interactions_search": {
                    "title": "Interactions & Recherche",
                    "description": "Affinez la façon dont les entités sont épinglées et le nombre de résultats."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Thème & Mise en page",
                    "description": "Adaptez au style de votre tableau de bord et contrôlez l'empreinte globale."
                },
                "controls_typography": {
                    "title": "Commandes & Typographie",
                    "description": "Ajustez la taille des boutons, les étiquettes et le texte adaptatif."
                },
                "collapsed_idle": {
                    "title": "États Réduits & Veille",
                    "description": "Contrôlez quand la carte se réduit et quelles vues s'affichent en veille."
                }
            },
            "actions": {
                "title": "Actions",
                "description": "Créez les jetons d'action. Glissez pour réordonner, cliquez sur le crayon pour configurer."
            }
        },
        "subtitles": {
            "idle_timeout": "Temps en millisecondes avant la mise en veille. 0 pour désactiver.",
            "show_chip_row": "\"Auto\" masque la barre de jetons si une seule entité est configurée. \"Dans le Menu\" déplace les jetons.",
            "dim_chips": "Assombrir les jetons en mode veille pour un look plus épuré.",
            "hold_to_pin": "Appui long pour épingler au lieu d'un appui court.",
            "disable_autofocus": "Empêcher la recherche de prendre le focus automatiquement.",
            "search_within_filter": "Rechercher dans le filtre actif actuel (Favoris, etc.).",
            "close_search_on_play": "Fermer automatiquement la recherche à la lecture.",
            "pin_search_headers": "Garder la recherche et les filtres fixes en haut.",
            "disable_mass": "Désactiver l'intégration Mass Queue.",
            "swap_pause_stop": "Remplacer le bouton pause par stop en mode moderne.",
            "adaptive_controls": "Laisser les boutons s'adapter à l'espace disponible.",
            "hide_menu_player": "Masquer l'étiquette de l'entité en bas quand les jetons sont dans le menu.",
            "adaptive_text": "Choisir quels textes doivent s'adapter à l'espace.",
            "collapse_expand": "Toujours réduit crée un mini lecteur. Agrandir à la Recherche agrandit temporairement.",
            "idle_screen": "Choisir l'écran à afficher automatiquement en veille.",
            "hide_controls": "Sélectionner les commandes à masquer pour cette entité.",
            "hide_search_chips": "Masquer des jetons de filtrage spécifiques.",
            "follow_active_entity": "L'entité de volume suivra automatiquement l'entité active.",
            "search_limit_full": "Nombre maximum de résultats (1-1000, défaut: 20).",
            "result_sorting_full": "Choisir l'ordre des résultats. Par défaut conserve l'ordre source.",
            "card_height_full": "Laisser vide pour une hauteur automatique.",
            "control_layout_full": "Choisir entre l'ancienne mise en page ou la moderne.",
            "artwork_extend": "Étendre l'illustration sous les lignes de jetons.",
            "artwork_extend_label": "Étendre l'illustration",
            "no_artwork_overrides": "Aucun remplacement d'illustration configuré.",
            "entity_current_hint": "Utilisez 'entity_id: current' pour cibler le lecteur actuel.",
            "service_data_note": "Les changements ne sont enregistrés qu'en cliquant sur 'Enregistrer'.",
            "jinja_template_hint": "Entrez un modèle Jinja qui renvoie un entity_id.",
            "jinja_template_vol_hint": "Modèle pour l'entité de volume.",
            "not_available_alt_collapsed": "Non disponible en mode 'Toujours réduit'.",
            "not_available_collapsed": "Non disponible si 'Toujours réduit' est activé.",
            "only_available_collapsed": "Uniquement disponible si 'Toujours réduit' est activé.",
            "only_available_modern": "Uniquement disponible avec la mise en page Moderne.",
            "image_url_helper": "Entrez une URL directe vers une image ou un chemin de fichier local",
            "selected_entity_helper": "Helper de texte d'entrée qui sera mis à jour avec l'ID de l'entité du lecteur multimédia actuellement sélectionné.",
            "sync_entity_type": "Choisissez quel ID d'entité synchroniser avec le helper (par défaut l'entité Music Assistant si configurée)."
        },
        "titles": {
            "edit_entity": "Modifier l'entité",
            "edit_action": "Modifier l'action",
            "service_data": "Données du service",
            "add_artwork_override": "Ajouter un remplacement"
        },
        "labels": {
            "dim_chips": "Assombrir les jetons en veille",
            "hold_to_pin": "Maintenir pour épingler",
            "disable_autofocus": "Désactiver l'autofocus",
            "keep_filters": "Garder les filtres",
            "dismiss_on_play": "Fermer en lecture",
            "pin_headers": "Épingler les en-têtes",
            "disable_mass": "Désactiver Mass Queue",
            "match_theme": "Suivre le thème",
            "alt_progress": "Barre de progression alternative",
            "display_timestamps": "Afficher les horodatages",
            "swap_pause_stop": "Remplacer Pause par Stop",
            "adaptive_controls": "Taille adaptative",
            "hide_active_entity": "Masquer l'étiquette active",
            "collapse_on_idle": "Réduire en veille",
            "hide_menu_player_toggle": "Masquer le lecteur menu",
            "always_collapsed": "Toujours réduit",
            "expand_on_search": "Agrandir en recherche",
            "script_var": "Variable script (yamp_entity)",
            "use_ma_template": "Utiliser modèle MA",
            "use_vol_template": "Utiliser modèle Volume",
            "follow_active_entity": "Le volume suit l'entité active",
            "use_url_path": "Utiliser URL ou chemin",
            "adaptive_text_elements": "Éléments de texte adaptatif"
        },
        "fields": {
            "artwork_fit": "Ajustement",
            "artwork_position": "Position",
            "artwork_hostname": "Hôte",
            "match_field": "Champ de correspondance",
            "match_value": "Valeur de correspondance",
            "size_percent": "Taille (%)",
            "object_fit": "Object Fit",
            "idle_timeout": "Veille (ms)",
            "show_chip_row": "Afficher les jetons",
            "search_limit": "Limite de résultats",
            "result_sorting": "Tri des résultats",
            "vol_step": "Pas du volume",
            "card_height": "Hauteur (px)",
            "control_layout": "Mise en page",
            "save_service_data": "Enregistrer",
            "image_url": "URL image",
            "fallback_image_url": "URL de secours",
            "move_to_main": "Mettre dans les jetons principaux",
            "move_to_menu": "Mettre dans le menu",
            "delete_action": "Supprimer l'action",
            "revert_service_data": "Annuler les changements",
            "test_action": "Tester l'action",
            "volume_mode": "Mode volume",
            "idle_screen": "Écran de veille",
            "name": "Nom",
            "hidden_controls": "Commandes masquées",
            "ma_template": "Modèle MA (Jinja)",
            "hidden_chips": "Jetons masqués",
            "vol_template": "Modèle Volume (Jinja)",
            "icon": "Icône",
            "action_type": "Type d'action",
            "menu_item": "Élément du menu",
            "nav_path": "Chemin navigation",
            "service": "Service",
            "service_data": "Données",
            "idle_image_entity": "Entité image veille",
            "match_entity": "Entité de correspondance",
            "ma_entity": "Entité Music Assistant",
            "vol_entity": "Entité de volume",
            "selected_entity_helper": "Helper d'entité sélectionnée",
            "sync_entity_type": "Type d'entité à synchroniser"
        },
        "action_types": {
            "menu": "Ouvrir un élément de menu",
            "service": "Appeler un service",
            "navigate": "Naviguer",
            "sync_selected_entity": "Synchroniser l'entité sélectionnée"
        },
        "action_helpers": {
            "sync_selected_entity": "Synchroniser l'entité sélectionnée →",
            "select_helper": "(sélectionner helper)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Entité Music Assistant si configurée)",
            "yamp_main_entity": "yamp_main_entity (Entité principale du lecteur)",
            "yamp_playback_entity": "yamp_playback_entity (Entité de lecture active actuelle)"
        }
    },
    "card": {
        "sections": {
            "details": "Détails lecture",
            "menu": "Menu & Recherche",
            "action_chips": "Jetons d'action"
        },
        "media_controls": {
            "shuffle": "Aléatoire",
            "previous": "Précédent",
            "play_pause": "Lecture/Pause",
            "stop": "Arrêt",
            "next": "Suivant",
            "repeat": "Répéter"
        },
        "menu": {
            "more_info": "Plus d'infos",
            "search": "Rechercher",
            "source": "Source",
            "transfer_queue": "Transférer la file",
            "group_players": "Grouper les lecteurs",
            "select_entity": "Choisir pour plus d'infos",
            "transfer_to": "Transférer vers",
            "no_players": "Aucun lecteur MA disponible."
        },
        "grouping": {
            "title": "Grouper les lecteurs",
            "sync_volume": "Synchroniser volume",
            "group_all": "Grouper tout",
            "ungroup_all": "Dégrouper tout",
            "unavailable": "Lecteur indisponible",
            "no_players": "Aucun lecteur groupable.",
            "master": "Maître",
            "joined": "Lié",
            "available": "Disponible",
            "current": "Actuel"
        }
    },
    "search": {
        "favorites": "Favoris",
        "recently_played": "Récemment lus",
        "next_up": "À suivre",
        "recommendations": "Recommandations",
        "radio_mode": "Mode Radio",
        "close": "Fermer la recherche",
        "no_results": "Aucun résultat.",
        "play_next": "Lire après",
        "replace_play": "Remplacer et lire",
        "replace": "Remplacer file",
        "add_queue": "Ajouter à la fin",
        "move_up": "Monter",
        "move_down": "Descendre",
        "move_next": "Passer au suivant",
        "remove": "Retirer de la file",
        "added": "Ajouté à la file !",
        "labels": {
            "replace": "Remplacer",
            "next": "Suivant",
            "replace_next": "Rempl. Suivant",
            "add": "Ajouter"
        },
        "results": "résultats",
        "result": "résultat",
        "filters": {
            "all": "Tout",
            "artist": "Artiste",
            "album": "Album",
            "track": "Titre",
            "playlist": "Playlist",
            "radio": "Radio",
            "music": "Musique",
            "station": "Station",
            "podcast": "Podcast"
        },
        "search_artist": "Chercher cet artiste"
    }
};
