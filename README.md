# Yet Another Media Player

YAMP is a Home Assistant media card for controlling multiple entities with customizable actions and music assistant support.

---

## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)



---

## Features

- Switch between multiple media players in a single card using chips
- Group supported players
  - Control volume as a group or individually
  - Separate volume entity via YAML
  - Override sync volume behavior on a per entity basis using `group_volume`
- Music Assistant Support: Search music on compatible players
- Add background image sensor for when not in use
- Auto-switches to the active media player
  - Manually selected players will pin in place for the current session until manually removed
- Action buttons run any Home Assistant service or script 
  - Pass currently selected entity to a script
- Use "current" for the entity_id to reference the currently selected media player ([see example below](https://github.com/jianyu-li/yet-another-media-player#custom-actions))
- Set match_theme to TRUE to have the cards accent colors follow your selected accent theme color
- Use collapse_on_idle to collapse the card down when nothing is playing. This looks great on mobile!
- Use always_collapsed to keep the card collapsed even when something is playing

---

## Screenshots

![Preview Image](/Preview/largepreview.png)
![Preview Image Collapsed](/Preview/collapsed.png)
![Preview Image Search](/Preview/search.png)
![Preview Image Grouping](/Preview/group-player-menu.png)
![Preview Image Movie](/Preview/movie.png)
![Preview Image No Icon](/Preview/NoIcons.png)


---

## Basic Usage

Add the card to your Lovelace dashboard using YAML (for custom chip/entity names) or the UI (for default entity names). 

You can use music assistant actions in conjunction with "current" as the entity id and it will target whatever the current entity that is displayed in the card (e.g.: genres)

| **Option**                 | **Type**     | **Required** | **Default** | **Description**                                                                                 |
|----------------------------|--------------|--------------|-------------|-------------------------------------------------------------------------------------------------|
| **General Options**        |              |              |             |                                                                                                 |
| `type`                     | string       | Yes          | —           | `custom:yet-another-media-player`                                                               |
| `entities`                 | string/array | Yes          | —           | List of your media player entities                                                              |
| `match_theme`              | boolean      | No           | `false`     | Updates card accent colors to match your Home Assistant theme                                   |
| `collapse_on_idle`         | boolean      | No           | `false`     | Collapse the card when nothing is playing                                                       |
| `always_collapsed`         | boolean      | No           | `false`     | Keep the card collapsed even when something is playing                                          |
| `alternate_progress_bar`   | boolean      | No           | `false`     | Uses the collapsed progress bar when expanded                                                   |
| `idle_image`               | image/camera | No           | —           | Background image when player is idle                                                            |
| `show_chip_row`            | choice       | No           | `auto`      | `auto`: hides chip row if only one entity, `always`: always shows the chip row                  |
|                                                                                                 |
| **Entity Options**         |              |              |             |                                                                                                 |
| `volume_entity`            | string       | No           | —           | Separate entity for volume control (e.g., a remote for CEC TV volume)                           |
| `group_volume`             | boolean      | No           | `auto`      | Override default group volume logic for grouped players                                         |
| `sync_power`               | boolean      | No           | `false`     | Power on/off the volume entity with your main entity                                            |
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
- Bonus Tip: Click or tap the artist name on a currently playing track to initiate a search on that artist!
- Bonus Bonus Tip: On mobile, swipe left or right to rotate through the media type to quickly filter results.
![Preview Image Search](/Preview/search.png)


## Config Examples

### Full Example 
Customize entities using name and volume_entity (sets a different entity for volume control) arguments. 

```yaml
type: custom:yet-another-media-player
entities:
  - media_player.downstairs_2
  - media_player.kitchen_speaker_2
  - media_player.kitchen_homepod
  - entity_id: media_player.living_room_apple_tv
    volume_entity: media_player.living_room_sonos
    name: Living Room
    sync_power: true
  - entity_id: media_player.bedroom
    group_volume: false
  - media_player.entryway_speaker
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
```

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
    description: Target media player
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
- Entity names and separate volume entities are set via YAML. The ui will show "[object Object]" for customized entities
- Actions can run any home assistant service, not just media services. Specifying "current" in the entity_id field will target the currently selected entity. 
- Grouping players only works on supported entities, if the entity is not supported the option will not be visible





---

## Support the project

Like having Yet Another Media Player? You can show your support with a coffee ☕️

<a href="https://www.buymeacoffee.com/jianyu_li" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 127px !important;" ></a>
