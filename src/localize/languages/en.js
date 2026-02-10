export default {
    "common": {
        "not_found": "Entity not found.",
        "search": "Search",
        "power": "Power",
        "favorite": "Favorite",
        "loading": "Loading...",
        "no_results": "No results.",
        "close": "Close",
        "vol_up": "Volume Up",
        "vol_down": "Volume Down",
        "media_player": "Media Player",
        "edit_entity": "Edit Entity Settings",
        "edit_action": "Edit Action Settings",
        "mute": "Mute",
        "unmute": "Unmute",
        "seek": "Seek",
        "volume": "Volume",
        "play_now": "Play Now",
        "more_options": "More Options",
        "unavailable": "Unavailable",
        "back": "Back",
        "cancel": "Cancel",
        "reset_default": "Reset to default"
    },
    "editor": {
        "tabs": {
            "entities": "Entities",
            "behavior": "Behavior",
            "look_and_feel": "Look and Feel",
            "artwork": "Artwork",
            "actions": "Actions"
        },
        "placeholders": {
            "search": "Search music..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "General Settings",
                    "description": "Global controls for how artwork is displayed and retrieved."
                },
                "idle": {
                    "title": "Idle Artwork",
                    "description": "Show a static image or entity snapshot whenever nothing is playing."
                },
                "overrides": {
                    "title": "Artwork Overrides",
                    "description": "Overrides are evaluated from top to bottom. Drag to reorder."
                }
            },
            "entities": {
                "title": "Entities*",
                "description": "Add the media players you want to control. Drag entities to reorder the chip row."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Idle & Chips",
                    "description": "Choose when the card goes idle and how entity chips behave."
                },
                "interactions_search": {
                    "title": "Interactions & Search",
                    "description": "Fine-tune how entities are pinned and how many results show at once."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Theme & Layout",
                    "description": "Match dashboard styling and control the overall footprint."
                },
                "controls_typography": {
                    "title": "Controls & Typography",
                    "description": "Tune button sizing, entity labels, and adaptive text."
                },
                "collapsed_idle": {
                    "title": "Collapsed & Idle States",
                    "description": "Control when the card collapses and which views show while idle."
                }
            },
            "actions": {
                "title": "Actions",
                "description": "Build the action chips that appear in the card or its menu. Drag to reorder, click the pencil to configure each action."
            }
        },
        "subtitles": {
            "idle_timeout": "Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.",
            "show_chip_row": "\"Auto\" hides the chip row when only one entity is configured. \"In Menu\" moves the chips into the menu overlay. \"In Menu on Idle\" shows chips inline when active but moves them to the menu when idle.",
            "dim_chips": "When the card enters idle mode with an image, dim the entity and action chips for a cleaner look.",
            "hold_to_pin": "Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.",
            "disable_autofocus": "Keep the search box from stealing focus so on-screen keyboards stay hidden.",
            "search_within_filter": "Enable this to search within the current active filter (Favorites, Recently Played, etc) instead of clearing it.",
            "close_search_on_play": "Automatically close the search screen when a track is played.",
            "pin_search_headers": "Keep search input and filters fixed at the top while scrolling results.",
            "hide_search_headers_on_idle": "Hide search input and filters when the player is idle.",
            "disable_mass": "Disable the optional Mass Queue integration even if it is installed.",
            "swap_pause_stop": "Replace the pause button with stop while using the modern layout.",
            "adaptive_controls": "Let the playback buttons grow or shrink to fit the available space.",
            "hide_menu_player": "When chips live in the menu, hide the entity label at the bottom of the card.",
            "adaptive_text": "Choose which text groups should scale with available space (leave empty to disable adaptive text).",
            "collapse_expand": "Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.",
            "idle_screen": "Choose which screen to display automatically when the card becomes idle.",
            "hide_controls": "Select which controls to hide for this entity (all are shown by default)",
            "hide_search_chips": "Hide specific search filter chips for this entity",
            "follow_active_entity": "When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.",
            "search_limit_full": "Maximum number of search results to display (1-1000, default: 20)",
            "result_sorting_full": "Choose how results are ordered. Sorting is handled server-side by Music Assistant.",
            "card_height_full": "Leave blank for automatic height",
            "control_layout_full": "Choose between the legacy evenly sized controls or the modern Home Assistant layout.",
            "artwork_extend": "Let the artwork background continue underneath the chip and action rows.",
            "artwork_extend_label": "Extend artwork",
            "no_artwork_overrides": "No artwork overrides configured. Use the plus button below to add one.",
            "entity_current_hint": "Use 'entity_id: current' to target the card's currently selected media player entity. Note: The 'Test Action' button will be disabled when using this feature.",
            "service_data_note": "Changes to the service data below are not committed to the config until the 'Save Service Data' button is clicked!",
            "jinja_template_hint": "Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:",
            "jinja_template_vol_hint": "Enter a Jinja template that resolves to an entity_id (e.g. media_player.office_homepod or remote.soundbar). Example switching volume entity based on a boolean:",
            "not_available_alt_collapsed": "Not available with Alternate Progress Bar or Always Collapsed mode",
            "not_available_collapsed": "Not available when Always Collapsed is enabled",
            "only_available_collapsed": "Only available when Always Collapsed is enabled",
            "only_available_modern": "Only available with Modern layout",
            "image_url_helper": "Enter a direct URL to an image or a local file path",
            "selected_entity_helper": "Input text helper that will be updated with the currently selected media player entity ID.",
            "sync_entity_type": "Choose which entity ID to sync to the helper (defaults to Music Assistant entity if configured).",
            "disable_auto_select": "Prevent this entity's chip from automatically being selected when it starts playing.",
            "search_view": "Choose between a standard list or a card-based grid for search results.",
            "search_card_columns": "Specify how many columns to use in the card view. Artwork will scale automatically.",
            "randomize_initial": "Shuffle the favorites list each time you open the search screen."
        },
        "titles": {
            "edit_entity": "Edit Entity",
            "edit_action": "Edit Action",
            "service_data": "Service Data",
            "add_artwork_override": "Add Artwork Override"
        },
        "labels": {
            "dim_chips": "Dim Chips on Idle",
            "hold_to_pin": "Hold to Pin",
            "disable_autofocus": "Disable Search Autofocus",
            "keep_filters": "Keep Filters on Search",
            "dismiss_on_play": "Dismiss search on play",
            "pin_headers": "Pin search headers",
            "hide_search_headers_on_idle": "Hide search headers on idle",
            "disable_mass": "Disable Mass Queue",
            "match_theme": "Match Theme",
            "alt_progress": "Alternate Progress Bar",
            "display_timestamps": "Display Timestamps",
            "swap_pause_stop": "Swap Pause with Stop",
            "adaptive_controls": "Adaptive Control Size",
            "hide_active_entity": "Hide Active Entity Label",
            "collapse_on_idle": "Collapse on Idle",
            "hide_menu_player_toggle": "Hide Menu Player",
            "always_collapsed": "Always Collapsed",
            "expand_on_search": "Expand on Search",
            "script_var": "Script Variable (yamp_entity)",
            "use_ma_template": "Use template for Music Assistant Entity",
            "use_vol_template": "Use template for Volume Entity",
            "follow_active_entity": "Volume Entity Follows Active Entity",
            "use_url_path": "Use URL or Path",
            "adaptive_text_elements": "Adaptive Text Size Elements",
            "disable_auto_select": "Disable Auto-Select",
            "randomize_initial": "Randomize Initial Results"
        },
        "fields": {
            "artwork_fit": "Artwork Fit",
            "artwork_position": "Artwork Position",
            "artwork_hostname": "Artwork Hostname",
            "match_field": "Match Field",
            "match_value": "Match Value",
            "size_percent": "Size (%)",
            "object_fit": "Object Fit",
            "idle_timeout": "Idle Timeout (ms)",
            "show_chip_row": "Show Chip Row",
            "search_limit": "Search Results Limit",
            "result_sorting": "Result Sorting",
            "vol_step": "Volume Step (0.05 = 5%)",
            "card_height": "Card Height (px)",
            "control_layout": "Control Layout",
            "save_service_data": "Save Service Data",
            "image_url": "Image URL",
            "fallback_image_url": "Fallback Image URL",
            "move_to_main": "Move action to main chips",
            "move_to_menu": "Move action into menu",
            "delete_action": "Delete Action",
            "revert_service_data": "Revert to Saved Service Data",
            "test_action": "Test Action",
            "volume_mode": "Volume Mode",
            "idle_screen": "Idle Screen",
            "name": "Name",
            "hidden_controls": "Hidden Controls",
            "ma_template": "Music Assistant Entity Template (Jinja)",
            "hidden_chips": "Hidden Search Filter Chips",
            "vol_template": "Volume Entity Template (Jinja)",
            "icon": "Icon",
            "action_type": "Action Type",
            "menu_item": "Menu Item",
            "nav_path": "Navigation Path",
            "service": "Service",
            "service_data": "Service Data",
            "idle_image_entity": "Idle Image Entity",
            "match_entity": "Match Entity",
            "ma_entity": "Music Assistant Entity",
            "vol_entity": "Volume Entity",
            "selected_entity_helper": "Selected Entity Helper",
            "sync_entity_type": "Sync Entity Type",
            "placement": "Placement",
            "card_trigger": "Card Trigger",
            "search_view": "Search Result View",
            "search_card_columns": "Card Columns"
        },
        "action_types": {
            "menu": "Open a Card Menu Item",
            "service": "Call a Service",
            "navigate": "Navigate",
            "sync_selected_entity": "Sync Selected Entity"
        },
        "action_helpers": {
            "sync_selected_entity": "Sync Selected Entity →",
            "select_helper": "(select helper)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Music Assistant Entity if configured)",
            "yamp_main_entity": "yamp_main_entity (Main Media Player Entity)",
            "yamp_playback_entity": "yamp_playback_entity (Current Active Playback Entity)"
        },
        "placements": {
            "chip": "Action Chip",
            "menu": "In Menu",
            "hidden": "Hidden (Artwork Tap)",
            "not_triggerable": "Not Triggerable"
        },
        "triggers": {
            "none": "None",
            "tap": "Tap",
            "hold": "Hold",
            "double_tap": "Double Tap",
            "swipe_left": "Swipe Left",
            "swipe_right": "Swipe Right"
        },
        "search_view_options": {
            "list": "List",
            "card": "Card"
        }
    },
    "card": {
        "sections": {
            "details": "Now Playing Details",
            "menu": "Menu & Search Sheets",
            "action_chips": "Action Chips"
        },
        "media_controls": {
            "shuffle": "Shuffle",
            "previous": "Previous",
            "play_pause": "Play/Pause",
            "stop": "Stop",
            "next": "Next",
            "repeat": "Repeat"
        },
        "menu": {
            "more_info": "More Info",
            "search": "Search",
            "source": "Source",
            "transfer_queue": "Transfer Queue",
            "group_players": "Group Players",
            "select_entity": "Select Entity for More Info",
            "transfer_to": "Transfer Queue To",
            "no_players": "No other Music Assistant players available."
        },
        "grouping": {
            "title": "Group Players",
            "sync_volume": "Sync Volume",
            "group_all": "Group All",
            "ungroup_all": "Ungroup All",
            "unavailable": "Player is unavailable",
            "no_players": "No other group-capable players available.",
            "master": "Master",
            "joined": "Joined",
            "available": "Available",
            "current": "Current"
        }
    },
    "search": {
        "favorites": "Favorites",
        "recently_played": "Recently Played",
        "next_up": "Next Up",
        "recommendations": "Recommendations",
        "radio_mode": "Radio Mode",
        "close": "Close Search",
        "no_results": "No results.",
        "play_next": "Play next",
        "replace_play": "Replace existing queue and play now",
        "replace": "Replace queue",
        "add_queue": "Add to the end of the queue",
        "move_up": "Move Up",
        "move_down": "Move Down",
        "move_next": "Move to Next",
        "remove": "Remove from Queue",
        "added": "Added to queue!",
        "labels": {
            "replace": "Replace",
            "next": "Next",
            "replace_next": "Replace Next",
            "add": "Add"
        },
        "results": "results",
        "result": "result",
        "filters": {
            "all": "All",
            "artist": "Artist",
            "album": "Album",
            "track": "Track",
            "playlist": "Playlist",
            "radio": "Radio",
            "music": "Music",
            "station": "Station",
            "podcast": "Podcast"
        },
        "search_artist": "Search for this artist"
    }
};
