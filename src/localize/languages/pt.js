export default {
    "common": {
        "not_found": "Entidade não encontrada.",
        "search": "Procurar",
        "power": "Ligar/Desligar",
        "favorite": "Favorito",
        "loading": "A carregar...",
        "no_results": "Sem resultados.",
        "close": "Fechar",
        "vol_up": "Aumentar volume",
        "vol_down": "Diminuir volume",
        "media_player": "Leitor multimédia",
        "edit_entity": "Editar definições da entidade",
        "edit_action": "Editar definições da ação",
        "mute": "Silenciar",
        "unmute": "Ativar som",
        "seek": "Procurar",
        "volume": "Volume",
        "play_now": "Reproduzir agora",
        "more_options": "Mais opções",
        "unavailable": "Indisponível",
        "back": "Voltar",
        "cancel": "Cancelar",
        "reset_default": "Repor predefinições"
    },
    "editor": {
        "tabs": {
            "entities": "Entidades",
            "behavior": "Comportamento",
            "look_and_feel": "Aspeto",
            "artwork": "Capa",
            "actions": "Ações"
        },
        "placeholders": {
            "search": "Procurar música..."
        },
        "sections": {
            "artwork": {
                "general": {
                    "title": "Definições gerais",
                    "description": "Controlos globais para a capa."
                },
                "idle": {
                    "title": "Capa em repouso",
                    "description": "Mostrar imagem estática quando nada toca."
                },
                "overrides": {
                    "title": "Substituições de capa",
                    "description": "As substituições são avaliadas de cima para baixo."
                }
            },
            "entities": {
                "title": "Entidades*",
                "description": "Adicione os leitores a controlar."
            },
            "behavior": {
                "idle_chips": {
                    "title": "Repouso e chips",
                    "description": "Escolha quando ir para repouso."
                },
                "interactions_search": {
                    "title": "Interações e procura",
                    "description": "Ajuste a fixação de entidades."
                }
            },
            "look_and_feel": {
                "theme_layout": {
                    "title": "Tema e design",
                    "description": "Combine com o estilo do dashboard."
                },
                "controls_typography": {
                    "title": "Controlos e tipografia",
                    "description": "Ajuste botões e etiquetas."
                },
                "collapsed_idle": {
                    "title": "Estados contraído e repouso",
                    "description": "Controle o contraído do cartão."
                }
            },
            "actions": {
                "title": "Ações",
                "description": "Crie chips de ação."
            }
        },
        "subtitles": {
            "idle_timeout": "Tempo antes de repouso (ms). 0 para desativar.",
            "show_chip_row": "\"Auto\" oculta a linha se houver apenas uma entidade. \"No menu\" move os chips. \"No menu em repouso\" mostra os chips em linha quando ativo mas move-os para o menu quando em repouso.",
            "dim_chips": "Escurecer chips em repouso para um aspeto mais limpo.",
            "hold_to_pin": "Manter premido para fixar em vez de toque curto.",
            "disable_autofocus": "Evitar que a procura tome o foco automaticamente.",
            "search_within_filter": "Procurar no filtro ativo (Favoritos, etc.).",
            "close_search_on_play": "Fechar procura ao reproduzir.",
            "pin_search_headers": "Fixar cabeçalhos de procura ao fazer scroll.",
            "disable_mass": "Desativar integração Mass Queue.",
            "swap_pause_stop": "Substituir pausa por stop no design moderno.",
            "adaptive_controls": "Permitir que os botões se adaptem ao espaço.",
            "hide_menu_player": "Ocultar nome da entidade quando no menu.",
            "adaptive_text": "Escolher que textos se adaptam ao espaço.",
            "collapse_expand": "Sempre contraído ativa modo mini. Expandir ao procurar expande temporariamente.",
            "idle_screen": "Escolher ecrã a mostrar em repouso.",
            "hide_controls": "Selecionar controlos a ocultar.",
            "hide_search_chips": "Ocultar chips de filtro de procura.",
            "follow_active_entity": "A entidade de volume seguirá a ativa.",
            "search_limit_full": "Máximo de resultados (1-1000, default: 20).",
            "result_sorting_full": "Escolher ordem dos resultados.",
            "card_height_full": "Deixar vazio para altura automática.",
            "control_layout_full": "Escolher entre design antigo ou moderno.",
            "artwork_extend": "Estender capa sob os chips.",
            "artwork_extend_label": "Estender capa",
            "no_artwork_overrides": "Sem substituições de capa configuradas.",
            "entity_current_hint": "Use 'entity_id: current' para o leitor atual.",
            "service_data_note": "As alterações são guardadas ao premir 'Guardar'.",
            "jinja_template_hint": "Modelo Jinja para entity_id.",
            "jinja_template_vol_hint": "Modelo para entidade volume.",
            "not_available_alt_collapsed": "Não disponível em modo contraído.",
            "not_available_collapsed": "Não disponível se contraído.",
            "only_available_collapsed": "Apenas disponível se contraído.",
            "only_available_modern": "Apenas disponível com layout Moderno.",
            "image_url_helper": "Insira um URL direto para uma imagem ou um caminho de arquivo local",
            "selected_entity_helper": "Helper de texto de entrada que será atualizado com o ID da entidade do reprodutor de mídia selecionado no momento.",
            "sync_entity_type": "Escolha qual ID de entidade sincronizar com o helper (padrão entidade Music Assistant se configurada).",
            "disable_auto_select": "Impede que o chip desta entidade seja selecionado automaticamente quando a reprodução é iniciada."
        },
        "titles": {
            "edit_entity": "Editar entidade",
            "edit_action": "Editar ação",
            "service_data": "Dados do serviço",
            "add_artwork_override": "Adicionar substituição"
        },
        "labels": {
            "dim_chips": "Escurecer chips em repouso",
            "hold_to_pin": "Manter para fixar",
            "disable_autofocus": "Desativar autofoco",
            "keep_filters": "Manter filtros",
            "dismiss_on_play": "Fechar ao reproduzir",
            "pin_headers": "Fixar cabeçalhos",
            "disable_mass": "Desativar Mass Queue",
            "match_theme": "Seguir tema",
            "alt_progress": "Barra de progresso alternativa",
            "display_timestamps": "Mostrar carimbos de tempo",
            "swap_pause_stop": "Substituir Pausa por Stop",
            "adaptive_controls": "Tamanho adaptativo",
            "hide_active_entity": "Ocultar nome da entidade ativa",
            "collapse_on_idle": "Contrair em repouso",
            "hide_menu_player_toggle": "Ocultar leitor do menu",
            "always_collapsed": "Sempre contraído",
            "expand_on_search": "Expandir ao procurar",
            "script_var": "Variável script (yamp_entity)",
            "use_ma_template": "Usar modelo MA",
            "use_vol_template": "Usar modelo Volume",
            "follow_active_entity": "Volume segue a entidade ativa",
            "use_url_path": "Usar URL ou caminho",
            "adaptive_text_elements": "Elementos de texto adaptativo",
            "disable_auto_select": "Desativar seleção automática"
        },
        "fields": {
            "artwork_fit": "Ajuste",
            "artwork_position": "Posição",
            "artwork_hostname": "Host",
            "match_field": "Campo",
            "match_value": "Valor",
            "size_percent": "Tamanho (%)",
            "object_fit": "Object Fit",
            "idle_timeout": "Repouso (ms)",
            "show_chip_row": "Mostrar chips",
            "search_limit": "Limite de procura",
            "result_sorting": "Ordem",
            "vol_step": "Passo de volume",
            "card_height": "Altura (px)",
            "control_layout": "Design",
            "save_service_data": "Guardar",
            "image_url": "URL imagem",
            "fallback_image_url": "URL de reserva",
            "move_to_main": "Mover para chips principais",
            "move_to_menu": "Mover para o menu",
            "delete_action": "Eliminar ação",
            "revert_service_data": "Anular alterações",
            "test_action": "Testar ação",
            "volume_mode": "Modo volume",
            "idle_screen": "Ecrã de repouso",
            "name": "Nome",
            "hidden_controls": "Controlos ocultos",
            "ma_template": "Modelo MA (Jinja)",
            "hidden_chips": "Chips ocultos",
            "vol_template": "Modelo Volume (Jinja)",
            "icon": "Ícone",
            "action_type": "Tipo de ação",
            "menu_item": "Item de menu",
            "nav_path": "Caminho",
            "service": "Serviço",
            "service_data": "Dados",
            "idle_image_entity": "Entidade imagem repouso",
            "match_entity": "Entidade",
            "ma_entity": "Entidade Music Assistant",
            "vol_entity": "Entidade de volume",
            "selected_entity_helper": "Helper de entidade selecionada",
            "sync_entity_type": "Tipo de entidade a sincronizar",
            "placement": "Posicionamento",
            "card_trigger": "Gatilho do cartão"
        },
        "action_types": {
            "menu": "Abrir um item do menu",
            "service": "Chamar um serviço",
            "navigate": "Navegar",
            "sync_selected_entity": "Sincronizar entidade selecionada"
        },
        "action_helpers": {
            "sync_selected_entity": "Sincronizar entidade selecionada →",
            "select_helper": "(selecionar helper)"
        },
        "sync_entity_options": {
            "yamp_entity": "yamp_entity (Entidade Music Assistant se configurada)",
            "yamp_main_entity": "yamp_main_entity (Entidade principal do reprodutor)",
            "yamp_playback_entity": "yamp_playback_entity (Entidade de reprodução ativa atual)"
        },
        "placements": {
            "chip": "Chip de ação",
            "menu": "No menu",
            "hidden": "Oculto (Toque no Artwork)",
            "not_triggerable": "Não acionável"
        },
        "triggers": {
            "none": "Nenhum",
            "tap": "Toque",
            "hold": "Manter premido",
            "double_tap": "Toque duplo"
        }
    },
    "card": {
        "sections": {
            "details": "Detalhes de reprodução",
            "menu": "Menu e Procura",
            "action_chips": "Chips de ação"
        },
        "media_controls": {
            "shuffle": "Aleatório",
            "previous": "Anterior",
            "play_pause": "Reproduzir/Pausa",
            "stop": "Parar",
            "next": "Seguinte",
            "repeat": "Repetir"
        },
        "menu": {
            "more_info": "Mais info",
            "search": "Procurar",
            "source": "Fonte",
            "transfer_queue": "Transferir fila",
            "group_players": "Agrupar",
            "select_entity": "Selecionar",
            "transfer_to": "Transferir para",
            "no_players": "Sem leitores MA."
        },
        "grouping": {
            "title": "Agrupar",
            "sync_volume": "Sincronizar volume",
            "group_all": "Agrupar todos",
            "ungroup_all": "Separar todos",
            "unavailable": "Indisponível",
            "no_players": "Não agrupável.",
            "master": "Mestre",
            "joined": "Unido",
            "available": "Disponível",
            "current": "Atual"
        }
    },
    "search": {
        "favorites": "Favoritos",
        "recently_played": "Recentes",
        "next_up": "A seguir",
        "recommendations": "Recomendações",
        "radio_mode": "Modo Rádio",
        "close": "Fechar",
        "no_results": "Sem resultados.",
        "play_next": "Reproduzir seguinte",
        "replace_play": "Substituir e reproduzir",
        "replace": "Substituir fila",
        "add_queue": "Adicionar ao fim",
        "move_up": "Subir",
        "move_down": "Descer",
        "move_next": "Passar para seguinte",
        "remove": "Remover da fila",
        "added": "Adicionado!",
        "labels": {
            "replace": "Substituir",
            "next": "Seguinte",
            "replace_next": "Subst. seg.",
            "add": "Adicionar"
        },
        "results": "resultados",
        "result": "resultado",
        "filters": {
            "all": "Tudo",
            "artist": "Artista",
            "album": "Álbum",
            "track": "Faixa",
            "playlist": "Lista",
            "radio": "Rádio",
            "music": "Música",
            "station": "Estação",
            "podcast": "Podcast"
        },
        "search_artist": "Procurar este artista"
    }
};
