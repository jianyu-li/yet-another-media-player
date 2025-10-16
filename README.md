# Yet Another Media Player

YAMP is a Home Assistant media card for controlling multiple entities with customizable actions and music assistant support.



## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)



---

## Features

- Switch between multiple media players in a single card using chips
- Group supported players
  - Control volume as a group or individually
  - Separate volume entity 
  - Override sync volume behavior on a per entity basis using `group_volume`
- Music Assistant Support: Search music on compatible players
- Add background image sensor for when not in use
- Auto-switches to the active media player
  - Manually selected players will pin in place for the current session until manually removed
- Transfer queue between compatible Music Assistant players directly from the card menu
- Action buttons run any Home Assistant service or script 
  - Pass currently selected entity to a script
- Use "current" for the entity_id to reference the currently selected media player ([see example below](https://github.com/jianyu-li/yet-another-media-player#custom-actions))
- Set match_theme to TRUE to have the cards accent colors follow your selected accent theme color
- Use collapse_on_idle to collapse the card down when nothing is playing. This looks great on mobile!
- Use always_collapsed to keep the card collapsed even when something is playing

---

## Screenshots

![preview Image](/preview/largepreview.png)
![preview Image Collapsed](/preview/collapsed.png)
![preview Image Search](/preview/search.png)
![preview Image Grouping](/preview/group-player-menu.png)
![preview Image Transfer Queue](/preview/transfer-queue.png)
![preview Queue](/preview/up-next.png)
![preview Image Idle Image](/preview/idle-image-preview.png)
![preview Image Movie](/preview/movie.png)
![preview Image No Icon](/preview/NoIcons.png)


---

## Basic Usage
Below you will find a list of all configuration options. 
- You can use music assistant actions in conjunction with "current" as the entity id and it will target whatever the current entity that is displayed in the card (e.g.: genres)

| **Option**                 | **Type**     | **Required** | **Default** | **Description**                                                                                 |
|----------------------------|--------------|--------------|-------------|-------------------------------------------------------------------------------------------------|
| **General Options**        |              |              |             |                                                                                                 |
| `type`                     | string       | Yes          | —           | `custom:yet-another-media-player`                                                               |
| `entities`                 | string/array | Yes          | —           | List of your media player entities                                                              |
| `match_theme`              | boolean      | No           | `false`     | Updates card accent colors to match your Home Assistant theme                                   |
| `collapse_on_idle`         | boolean      | No           | `false`     | Collapse the card when nothing is playing                                                       |
| `always_collapsed`         | boolean      | No           | `false`     | Keep the card collapsed even when something is playing                                          |
| `expand_on_search`         | boolean      | No           | `false`     | Temporarily expand the card when search is open (only available when `always_collapsed` is `true`) |
| `hide_menu_player`         | boolean      | No           | `false`     | Hide the persistent media controls in the bottom sheet menu to reclaim space (only available when `always_collapsed` is `false`) |
| `alternate_progress_bar`   | boolean      | No           | `false`     | Uses the collapsed progress bar when expanded                                                   |
| `transfer_queue`           | menu action  | No           | —           | Adds a "Transfer Queue" menu action for Music Assistant entities (see below)                   |
| `idle_image`               | image/camera/url | No           | —           | Background image when player is idle (supports local files, cameras, or URLs)                   |
| `idle_timeout_ms`          | number       | No           | `0`         | Timeout in milliseconds before showing idle image (0 = never go idle)                           |
| `show_chip_row`            | choice       | No           | `auto`      | `auto`: hides chip row if only one entity, `always`: always shows the chip row                  |
|                                                                                                 |
| **Entity Options**         |              |              |             |                                                                                                 |
| `volume_entity`            | string       | No           | —           | Separate entity for volume control (e.g., a remote for CEC TV volume) (supports Jinja templates) |
| `follow_active_volume`     | boolean      | No           | `false`     | Make volume entity follow the active playback entity                                            |
| `music_assistant_entity`   | string       | No           | —           | Music Assistant entity for search/grouping (supports Jinja templates)                            |
| `group_volume`             | boolean      | No           | `auto`      | Override default group volume logic for grouped players                                         |
| `sync_power`               | boolean      | No           | `false`     | Power on/off the volume entity with your main entity                                            |
| `hidden_controls`          | array        | No           | `[]`        | Array of control names to hide for this specific entity         |
| `hidden_filter_chips`      | array        | No           | `[]`        | Hide specific search filter chips for this entity (UI only; does not change search results) |
|                                                                                                 |
| **Action Chip Options**    |              |              |             | (Each chip/action can have any/all of the below)                                                |
| `name`                     | string       | No           | —           | Name for the action chip                                                                        |
| `icon`                     | string       | No           | —           | MDI or custom icon for the action chip                                                          |
| `service`                  | string       | No           | —           | Home Assistant service to call (e.g., `media_player.play_media`)                                |
| `service_data`             | object       | No           | —           | Data to send with the service call                                                              |
| `menu_item`                | string       | No           | —           | Opens a card menu by type: `search`, `source`, `more-info`, `group-players`                    |
| `script_variable`          | boolean      | No           | `false`     | Pass the currently selected entity as `yamp_entity` to a script                                 |

# Group Players
Player entities can be grouped together for supported entities. Access the hamburger menu and choose "Group Players" to see a list of supported players that are currently configured on your card. If no players are supported (or only one entity is) then the "Group Players" option will not be visible. 
- Grouped entities will increase and decrease proportionately with the main entity. 
  - If only one entity is configured, and it is part of a group, only the volume for that entity will change. See `group_volume` for additional configuration options.
- Use the Grouped Players menu to adjust individual player volume or to sync the volume percentage across all grouped players to the main entity

# Search
Initiate a search using the hamburger menu and selecting `search`. Press Enter or click the `search` button after inputing your search query. To exit, click `cancel` or Esc on your keyboard. 
- **Favorites Filter**: Toggle the favorites button to show only favorited tracks
- **Recently Played Filter**: Toggle the recently played button to show your most recently played items. When enabled, results are fetched from Music Assistant ordered by most recently played. Only items that are part of your library will appear. You can still use the media-type chips to narrow the list. Submitting a new search query will start a normal search and turn off filters.
- **Next Up Filter**: Toggle the next up button to show the upcoming track in your queue. 
  - Install mass_queue to see and manage the entire upcoming queue! See documentation for Music Assistant Queue Actions below. 
- **Enqueue**: Use the enqueue button (playlist icon) to add tracks to your queue
- Bonus Tip: Click or tap the artist name on a currently playing track to initiate a search on that artist!
![preview Image Search](/preview/search.png)


## Config Examples

### Full Example 
Customize entities using name, volume_entity (sets a different entity for volume control), and music_assistant_entity (for search/grouping) arguments. 

```yaml
type: custom:yet-another-media-player
entities:
  - media_player.downstairs_2
  - media_player.kitchen_speaker_2
  - media_player.kitchen_homepod
  - entity_id: media_player.living_room_apple_tv
    volume_entity: media_player.living_room_sonos
    music_assistant_entity: media_player.living_room_homepod
    name: Living Room
    sync_power: true
  - entity_id: media_player.bedroom
    group_volume: false
  - media_player.entryway_speaker
  - entity_id: media_player.office_homepod
    name: Office
    follow_active_volume: true
    hidden_controls:
      - favorite
      - shuffle
actions:
  - icon: mdi:magnify
    menu_item: search
  - name: Soul
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.3cb881c4590341fabc374f003afaf2b4
      enqueue: replace
  - name: Set the Mood
    service: script.set_mood
    script_variable: true      
match_theme: true
volume_mode: slider
collapse_on_idle: true
always_collapsed: false
alternate_progress_bar: false
idle_image: camera.family_slideshow
idle_timeout_ms: 30000
  ```

### Expand on Search Example
When using `always_collapsed: true`, you can enable `expand_on_search: true` to temporarily expand the card to its normal size when the search interface is open:

```yaml
type: custom:yet-another-media-player
entities:
  - media_player.living_room_apple_tv
  - media_player.kitchen_homepod
actions:
  - icon: mdi:magnify
    menu_item: search
always_collapsed: true
expand_on_search: true
```

### Transfer Queue

The card can surface a **Transfer Queue** menu option for Music Assistant players. When the active entity supports queue transfers, selecting *Transfer Queue* opens a list of compatible targets and the queue moves instantly to the chosen player. The option only appears when a Music Assistant entity with a queue is selected.

### Custom Actions
You can also set mdi icons in the custom actions. This helps differentiate between music related actions and tv related actions. 

```yaml
actions:
  - icon: mdi:magnify
    menu_item: search
  - name: Grunge
    service: music_assistant.play_media
    icon: mdi:music
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.5feba9fd5ea441a29aeb3597c8314384
      enqueue: replace
  - name: Play Bluey
    icon: mdi:television-play
    service: script.play_bluey_on_living    
```

## Music Assistant Entity Configuration

You can associate a Music Assistant entity with any media player to enable search and grouping functionality. Since Music Assistant creates a "duplicate" companion entity, you can essentially use this function to combine the main entity with the music assistant companion entity into a single chip.

This is also particularly useful for Universal Media Player (UMP) setups where you want physical control (amp power, source switching) through the main entity while using Music Assistant for advanced media features. When the card is actively using the music assistant entity, the chip will have an indicator outline.

**Favorite Button**: When using a Music Assistant entity, a favorite button (heart icon) will appear in the controls, allowing you to favorite the currently playing track. The button will only appear if you have a button entity configured with "favorite" or "like" in its name (e.g., `button.favorite_track` or `button.like_song`).

### Basic Example
```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.kitchen_homepod
    name: Kitchen
    music_assistant_entity: media_player.kitchen_homepod_2
```

### Jinja Template Example
For advanced users, you can use Jinja templates to dynamically select the Music Assistant entity:

```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.kitchen_homepod
    name: Kitchen
    music_assistant_entity: |
      {% if is_state('input_boolean.target_office','on') %}
        media_player.office_homepod_2
      {% else %}
        media_player.kitchen_homepod_2
      {% endif %}
```

## Volume Entity Configuration

You can use a separate `volume_entity` for volume display and control. This can be a static entity or a Jinja template that resolves to an entity id (e.g., `media_player.*` or `remote.*`). If `sync_power` is enabled, the resolved volume entity will be powered on/off along with the main entity.

### Follow Active Entity

You can also enable `follow_active_volume` to make the volume entity automatically follow the active playback entity. This is useful when you want volume controls to always target the entity that is currently playing, regardless of which chip is selected.

**Note**: When `follow_active_volume` is enabled, the sync power toggle will be automatically hidden in the config editor since it's not applicable in this mode.

```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.living_room_apple_tv
    name: Living Room
    follow_active_volume: true
  - entity_id: media_player.kitchen_homepod
    name: Kitchen
    follow_active_volume: true
```

### Basic Example
```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.living_room_apple_tv
    name: Living Room
    volume_entity: remote.living_room_apple_tv
    sync_power: true
```

### Jinja Template Example
```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.office_homepod
    name: Office
    volume_entity: |
      {% if is_state('input_boolean.tv_volume','on') %}
        remote.soundbar
      {% else %}
        media_player.office_homepod
      {% endif %}
    sync_power: true
```

## Hidden Controls Configuration

You can hide specific media player controls on a per-entity basis using the `hidden_controls` option. This is useful when you want to simplify the interface for certain entities or hide controls that aren't needed.

**Important**: The entity must still support the control for it to be visible in the first place. Hidden controls only hide controls that would normally be displayed based on the entity's capabilities.

### Available Control Names
- `previous` - Previous Track button
- `play_pause` - Play/Pause button  
- `stop` - Stop button
- `next` - Next Track button
- `shuffle` - Shuffle button
- `repeat` - Repeat button
- `favorite` - Favorite button (requires Music Assistant entity)
- `power` - Power on/off button

### Example Configuration
```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.living_room_apple_tv
    name: Living Room
    hidden_controls:
      - favorite
      - shuffle
      - repeat
  - entity_id: media_player.kitchen_homepod
    name: Kitchen
    hidden_controls:
      - power
```

In this example:
- The Living Room entity will hide the favorite, shuffle, and repeat buttons
- The Kitchen entity will hide only the power button
- All other controls will remain visible (if supported by the entity)

## Hidden Search Filter Chips (Per-Entity)

You can hide specific search filter chips on a per-entity basis using `hidden_filter_chips`. This only affects the chip UI; it does not change the underlying search results or API calls. It’s useful for focusing the search UI on the media types you care about.

### Available Chip Names
- `artist`
- `album`
- `track`
- `playlist`
- `radio`
- `podcast`
- `episode`

### Example Configuration
```yaml
type: custom:yet-another-media-player
entities:
  - entity_id: media_player.office_homepod
    name: Office
    music_assistant_entity: media_player.office_homepod_2
    hidden_filter_chips:
      - artist
      - album
      - track
      - podcast
```

## Search Results Limit Configuration

You can configure the maximum number of search results to display using the `search_results_limit` option. This is a global setting that affects all search operations including favorites, recently played, and regular searches across all entities.

### Configuration Options
- **Default**: 20 results
- **Range**: 1-100 results
- **Scope**: Global setting that applies to all entities and search types

### Example Configuration
```yaml
type: custom:yet-another-media-player-alpha
search_results_limit: 50
entities:
  - entity_id: media_player.living_room_apple_tv
    name: Living Room
  - entity_id: media_player.kitchen_homepod
    name: Kitchen
```

## Passing Current Entity to a Script

### Example YAML config
```yaml
type: custom:yet-another-media-player-beta
entities:
  - media_player.office_speaker_airplay
actions:
  - name: Set the Mood
    icon: mdi:heart
    service: script.set_mood
    script_variable: true
```    

### Example Script
```yaml
alias: set_mood
mode: single
fields:
  yamp_entity:
    description: Target media player (MA entity if configured, else main entity)
  yamp_main_entity:
    description: Main configured entity
  yamp_playback_entity:
    description: Currently active playback entity
sequence:
  - action: light.turn_off
    metadata: {}
    data: {}
    target:
      entity_id: light.bedroom
  - action: switch.turn_on
    metadata: {}
    data: {}
    target:
      entity_id: switch.fireplace
  - service: music_assistant.play_media
    data:
      entity_id: "{{ yamp_entity }}"
      media_id: apple_music://track/1445094678
      enqueue: replace
```

**Available Script Variables:**
- `yamp_entity`: The Music Assistant entity if configured, otherwise the main entity
- `yamp_main_entity`: The main configured entity
- `yamp_playback_entity`: The currently active playback entity (MA or main)  

### Input Source Actions
With [custom brand icons](https://github.com/elax46/custom-brand-icons) (also available on HACS), you can set up source actions with the providers logo.
Use the "name" argument to include a name or leave it off for icon only

```yaml
actions:
  - icon: phu:netflix
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Netflix
  - icon: phu:youtube
    service: media_player.select_source
    service_data:
      entity_id: current
      source: YouTube
  - icon: phu:hulu
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Hulu
```

### Radio Station Service Action
Example action for playing a radio station on [Chromecast](https://www.home-assistant.io/integrations/cast/). This also pushes an image to chromecast devices with a screen with the station (submitted by @rafaelmagic). 

```yaml
- name: 🎷 Jazz
  service: media_player.play_media
  service_data:
    entity_id: current
    media_content_id: https://streaming.live365.com/a49833
    media_content_type: music
    extra:
      metadata:
        metadataType: 3
        title: KJazz 88.1
        subtitle: KJazz 88.1
        images:
          - url: https://cdn-profiles.tunein.com/s37062/images/logod.jpg
```

## Card Mod Examples

### Decrease Height
You must adjust the ha-card height as well as .card-artwork-spacer min-height, see example: 
```
card_mod:
  style: |
    ha-card {
      height: 300px !important;
    }
    .card-artwork-spacer {
      min-height: 0px !important;
      }
```

### Increase Height
You must adjust the ha-card height as well as .card-artwork-spacer min-height, see example: 
```
card_mod:
  style: |
    ha-card {
      height: 700px !important;
    }
    .card-artwork-spacer {
      min-height: 0px !important;
      }
```

### Update Background Image
This is different from the idle_image argument (that allows a background image when not playing), using card-mod to change the background will apply the background at all times. 
```
card_mod:
  style: |
    ha-card {
      background-image: url('/local/image/background_dawn.png') !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
    }
    .media-artwork-placeholder {
      display: none !important /* optionally hide the placeholder image */
    }
```

## Notes

- When an entity is manually selected it will be pinned in place and will not auto-switch to the more recently playing entity for that session. Tap or click the pin icon that appears to unpin the entity.
- Actions can run any home assistant service, not just media services. Specifying "current" in the entity_id field will target the currently selected entity. 
- Grouping players only works on supported entities, if the entity is not supported the option will not be visible


---

## Optional: Music Assistant Queue Actions (mass_queue)

For enhanced queue controls in the Search sheet (e.g., viewing and reordering the upcoming queue, moving items up/down/next, and removing items), you can optionally install the community integration that adds Music Assistant queue services.

- Integration: `mass_queue` — Actions to control player queues for Music Assistant
- Install via HACS or manual install as described in the integration’s README
- Repository link: [droans/mass_queue](https://github.com/droans/mass_queue)

Once installed and configured, YAMP will automatically detect the integration and enable:
- Fetching the upcoming queue with `mass_queue.get_queue_items` (the existing ```search_results_limit``` will be used for this)
- Queue item reordering: move up, move down, move next
- Queue item removal

These features are optional. Without the integration, YAMP will fall back to a basic “next up” preview when available.





---

## Support the project

Like having Yet Another Media Player? You can show your support with a coffee ☕️

<a href="https://www.buymeacoffee.com/jianyu_li" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 127px !important;" ></a>
