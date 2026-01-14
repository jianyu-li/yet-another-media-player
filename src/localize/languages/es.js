export default {
    "common": {
        "not_found": "Entidad no encontrada.",
        "search": "Buscar",
        "power": "Encendido",
        "favorite": "Favorito",
        "loading": "Cargando...",
        "no_results": "Sin resultados.",
        "close": "Cerrar",
        "vol_up": "Subir volumen",
        "vol_down": "Bajar volumen",
        "media_player": "Reproductor de medios",
        "edit_entity": "Editar configuración de entidad",
        "edit_action": "Editar configuración de acción",
        "mute": "Silenciar",
        "unmute": "Desactivar silencio",
        "seek": "Buscar posición",
        "volume": "Volumen",
        "play_now": "Reproducir ahora",
        "more_options": "Más opciones",
        "unavailable": "No disponible",
        "back": "Atrás",
        "cancel": "Cancelar",
        "reset_default": "Restablecer",
        "loading": "Cargando..."
    },
    "editor": {
        "tabs": {
            "entities": "Entidades",
            "behavior": "Comportamiento",
            "look_and_feel": "Apariencia",
            "artwork": "Ilustración",
            "actions": "Acciones"
        },
        "placeholders": {
            "search": "Buscar música..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Ajustes generales",
                    "description": "Controles globales sobre cómo se muestra y recupera la ilustración."
                },
                "idle": {
                    "title": "Ilustración en reposo",
                    "description": "Muestra una imagen estática o una instantánea de la entidad cuando no se está reproduciendo nada."
                },
                "overrides": {
                    "title": "Sustituciones de ilustración",
                    "description": "Las sustituciones se evalúan de arriba a abajo. Arrastre para reordenar."
                }
            },
            "entities": {
                "title": "Entidades*",
                "description": "Añada los reproductores de medios que desea controlar. Arrastre las entidades para reordenar la fila de fichas."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Reposo y fichas",
                    "description": "Elija cuándo entra la tarjeta en reposo y cómo se comportan las fichas de entidad."
                },
                "interactions_search": {
                    "title": "Interacciones y búsqueda",
                    "description": "Ajuste cómo se fijan las entidades y cuántos resultados se muestran a la vez."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Tema y diseño",
                    "description": "Haga coincidir el estilo del panel y controle el tamaño general."
                },
                "controls_typography": {
                    "title": "Controles y tipografía",
                    "description": "Ajuste el tamaño de los botones, las etiquetas de entidad y el texto adaptativo."
                },
                "collapsed_idle": {
                    "title": "Estados contraído y en reposo",
                    "description": "Controle cuándo se contrae la tarjeta y qué vistas se muestran durante el reposo."
                }
            },
            "actions": {
                "title": "Acciones",
                "description": "Cree las fichas de acción que aparecen en la tarjeta o en su menú. Arrastre para reordenar, haga clic en el lápiz para configurar cada acción."
            }
        },
        "subtitles": {
            "idle_timeout": "Tiempo en milisegundos antes de que la tarjeta entre en modo reposo. Establezca en 0 para desactivar el comportamiento en reposo.",
            "show_chip_row": "\"Auto\" oculta la fila de fichas cuando solo hay una entidad configurada. \"En menú\" mueve las fichas al menú superpuesto.",
            "dim_chips": "Cuando la tarjeta entre en modo reposo con una imagen, atenúe las fichas de entidad y de acción para un aspecto más limpio.",
            "hold_to_pin": "Mantenga pulsadas las fichas de entidad en lugar de una pulsación corta para fijarlas, evitando el cambio automático durante la reproducción.",
            "disable_autofocus": "Evite que el cuadro de búsqueda robe el foco para que los teclados en pantalla permanezcan ocultos.",
            "search_within_filter": "Active esta opción para buscar dentro del filtro activo (Favoritos, Reproducidos recientemente, etc.) en lugar de borrarlo.",
            "close_search_on_play": "Cierra automáticamente la pantalla de búsqueda cuando se reproduce una pista.",
            "pin_search_headers": "Mantenga la entrada de búsqueda y los filtros fijos en la parte superior mientras se desplaza por los resultados.",
            "disable_mass": "Desactive la integración opcional de Mass Queue incluso si está instalada.",
            "swap_pause_stop": "Sustituya el botón de pausa por el de detener mientras usa el diseño moderno.",
            "adaptive_controls": "Permita que los botones de reproducción crezcan o disminuyan para ajustarse al espacio disponible.",
            "hide_menu_player": "Cuando las fichas están en el menú, oculte la etiqueta de la entidad activa en la parte inferior de la tarjeta.",
            "adaptive_text": "Elija qué grupos de texto deben escalar con el espacio disponible (deje vacío para desactivar el texto adaptativo).",
            "collapse_expand": "Siempre contraído crea el modo de minireproductor. Expandir en búsqueda expande temporalmente al buscar.",
            "idle_screen": "Elija qué pantalla mostrar automáticamente cuando la tarjeta entre en reposo.",
            "hide_controls": "Seleccione qué controles ocultar para esta entidad (todos se muestran de forma predeterminada)",
            "hide_search_chips": "Ocultar fichas de filtro de búsqueda específicas para esta entidad",
            "follow_active_entity": "Cuando está habilitado, la entidad de volumen seguirá automáticamente a la entidad de reproducción activa. Nota: Esto anula la entidad de volumen seleccionada.",
            "search_limit_full": "Número máximo de resultados de búsqueda para mostrar (1-1000, predeterminado: 20)",
            "result_sorting_full": "Elija cómo se ordenan los resultados de búsqueda. El valor predeterminado mantiene el orden de origen.",
            "card_height_full": "Dejar en blanco para altura automática",
            "control_layout_full": "Elija entre los controles de tamaño uniforme heredados o el diseño moderno de Home Assistant.",
            "artwork_extend": "Permita que el fondo de la ilustración continúe debajo de las filas de fichas y acciones.",
            "artwork_extend_label": "Extender ilustración",
            "no_artwork_overrides": "No hay anulaciones de ilustración configuradas. Utilice el botón más de abajo para añadir una.",
            "entity_current_hint": "Use entity_id: current para apuntar a la entidad de reproductor multimedia actualmente seleccionada en la tarjeta. El botón de abajo no funcionará si utiliza esta función.",
            "service_data_note": "¡Los cambios en los datos del servicio a continuación no se confirman en la configuración hasta que se pulse el icono de guardar!",
            "jinja_template_hint": "Introduzca una plantilla Jinja que se resuelva en un único entity_id. Ejemplo de cambio de MA basado en un selector de fuente:",
            "jinja_template_vol_hint": "Introduzca una plantilla Jinja que se resuelva en un entity_id (p. ej., media_player.office_homepod o remote.soundbar). Ejemplo de cambio de la entidad de volumen basado en un booleano:",
            "not_available_alt_collapsed": "No disponible con la barra de progreso alternativa o el modo siempre contraído",
            "not_available_collapsed": "No disponible cuando siempre contraído está activado",
            "only_available_collapsed": "Solo disponible cuando siempre contraído está activado",
            "only_available_modern": "Solo disponible con el diseño moderno",
            "image_url_helper": "Introduzca una URL directa a una imagen o una ruta de archivo local"
        },
        "titles": {
            "edit_entity": "Editar entidad",
            "edit_action": "Editar acción",
            "service_data": "Datos del servicio",
            "add_artwork_override": "Añadir anulación de ilustración"
        },
        "labels": {
            "dim_chips": "Atenuar fichas en reposo",
            "hold_to_pin": "Mantener para fijar",
            "disable_autofocus": "Desactivar enfoque automático de búsqueda",
            "keep_filters": "Mantener filtros en la búsqueda",
            "dismiss_on_play": "Cerrar búsqueda al reproducir",
            "pin_headers": "Fijar encabezados de búsqueda",
            "disable_mass": "Desactivar Mass Queue",
            "match_theme": "Coincidir con el tema",
            "alt_progress": "Barra de progreso alternativa",
            "display_timestamps": "Mostrar marcas de tiempo",
            "swap_pause_stop": "Cambiar pausa por detener",
            "adaptive_controls": "Tamaño de control adaptativo",
            "hide_active_entity": "Ocultar etiqueta de entidad activa",
            "collapse_on_idle": "Contraer en reposo",
            "hide_menu_player_toggle": "Ocultar reproductor de menú",
            "always_collapsed": "Siempre contraído",
            "expand_on_search": "Expandir en búsqueda",
            "script_var": "Variable de script (yamp_entity)",
            "use_ma_template": "Usar plantilla para la entidad de Music Assistant",
            "use_vol_template": "Usar plantilla para la entidad de volumen",
            "follow_active_entity": "La entidad de volumen sigue a la entidad activa",
            "use_url_path": "Usar URL o ruta",
            "adaptive_text_elements": "Elementos de tamaño de texto adaptativo"
        },
        "fields": {
            "artwork_fit": "Ajuste de ilustración",
            "artwork_position": "Posición de ilustración",
            "artwork_hostname": "Nombre de host de ilustración",
            "match_field": "Campo de coincidencia",
            "match_value": "Valor de coincidencia",
            "size_percent": "Tamaño (%)",
            "object_fit": "Ajuste del objeto",
            "idle_timeout": "Tiempo de espera en reposo (ms)",
            "show_chip_row": "Mostrar fila de fichas",
            "search_limit": "Límite de resultados de búsqueda",
            "result_sorting": "Orden de los resultados",
            "vol_step": "Paso de volumen (0.05 = 5%)",
            "card_height": "Altura de la tarjeta (px)",
            "control_layout": "Diseño de controles",
            "save_service_data": "Guardar datos del servicio",
            "image_url": "URL de la imagen",
            "fallback_image_url": "URL de imagen de reserva",
            "move_to_main": "Mover acción a las fichas principales",
            "move_to_menu": "Mover acción al menú",
            "delete_action": "Eliminar acción",
            "revert_service_data": "Revertir a los datos de servicio guardados",
            "test_action": "Probar acción",
            "volume_mode": "Modo de volumen",
            "idle_screen": "Pantalla en reposo",
            "name": "Nombre",
            "hidden_controls": "Controles ocultos",
            "ma_template": "Plantilla de entidad de Music Assistant (Jinja)",
            "hidden_chips": "Fichas de filtro de búsqueda ocultas",
            "vol_template": "Plantilla de entidad de volumen (Jinja)",
            "icon": "Icono",
            "action_type": "Tipo de acción",
            "menu_item": "Elemento del menú",
            "nav_path": "Ruta de navegación",
            "service": "Servicio",
            "service_data": "Datos del servicio",
            "idle_image_entity": "Entidad de imagen en reposo",
            "match_entity": "Entidad de coincidencia",
            "ma_entity": "Entidad de Music Assistant",
            "vol_entity": "Entidad de volumen",
            "language": "Idioma"
        }
    },
    "card": {
        "sections": {
            "details": "Detalles de reproducción actual",
            "menu": "Menú y hojas de búsqueda",
            "action_chips": "Fichas de acción"
        },
        "media_controls": {
            "shuffle": "Aleatorio",
            "previous": "Anterior",
            "play_pause": "Reproducir/Pausa",
            "stop": "Detener",
            "next": "Siguiente",
            "repeat": "Repetir"
        },
        "menu": {
            "more_info": "Más información",
            "search": "Buscar",
            "source": "Fuente",
            "transfer_queue": "Transferir cola",
            "group_players": "Agrupar reproductores",
            "select_entity": "Seleccionar entidad para más información",
            "transfer_to": "Transferir cola a",
            "no_players": "No hay otros reproductores de Music Assistant disponibles."
        },
        "grouping": {
            "title": "Agrupar reproductores",
            "sync_volume": "Sincronizar volumen",
            "group_all": "Agrupar todos",
            "ungroup_all": "Desagrupar todos",
            "unavailable": "Reproductor no disponible",
            "no_players": "No hay otros reproductores compatibles con grupos disponibles.",
            "master": "Maestro",
            "joined": "Unido",
            "available": "Disponible",
            "current": "Actual"
        }
    },
    "search": {
        "favorites": "Favoritos",
        "recently_played": "Reproducidos recientemente",
        "next_up": "Siguiente",
        "recommendations": "Recomendaciones",
        "radio_mode": "Modo radio",
        "close": "Cerrar búsqueda",
        "no_results": "Sin resultados.",
        "play_next": "Reproducir a continuación",
        "replace_play": "Reemplazar cola existente y reproducir ahora",
        "replace": "Reemplazar cola",
        "add_queue": "Añadir al final de la cola",
        "move_up": "Mover arriba",
        "move_down": "Mover abajo",
        "move_next": "Mover a siguiente",
        "remove": "Eliminar de la cola",
        "added": "¡Añadido a la cola!",
        "labels": {
            "replace": "Reemplazar",
            "next": "Siguiente",
            "replace_next": "Sustituir",
            "add": "Añadir"
        },
        "results": "resultados",
        "result": "resultado",
        "filters": {
            "all": "Todo",
            "artist": "Artista",
            "album": "Álbum",
            "track": "Pista",
            "playlist": "Lista de reproducción",
            "radio": "Radio",
            "music": "Música",
            "station": "Emisora",
            "podcast": "Podcast"
        },
        "search_artist": "Buscar este artista"
    }
};
