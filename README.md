# Yet Another Media Player

YAMP is a Home Assistant media card for controlling multiple entities with customizable actions.

---

## Features

- Switch between multiple media players in a single card using chips
- Custom chip/entity names via YAML
- Separate volume entity via YAML
- Auto-switches to the active media player
  - Manually selected players will pin in place for the current session until manually removed
- Action buttons run any Home Assistant service or script 
- Add icons to custom actions to differentiate types (e.g.: playlist versus tv script)
- Use "current" for the entity_id to reference the currently selected media player (see example below)
- Set match_theme to TRUE to have the cards accent colors follow your selected accent theme color
- Use collapse_on_idle to collapse the card down when nothing is playing. This looks great on mobile!
- Use always_collapsed to keep the card collapsed even when something is playing

---

## Screenshots

![Preview Image](/Preview/large.png)
![Preview Image Collapsed](/Preview/collapsed.png)
![Preview Image Movie](/Preview/movie.png)
![Preview Image No Icon](/Preview/NoIcons.png)

---

## Basic Usage

Add the card to your Lovelace dashboard using YAML (for custom chip/entity names) or the UI (for default entity names). 

You can use music assistant actions in conjunction with "current" as the entity id and it will target whatever the current entity that is displayed in the card (e.g.: genres)

| Element   | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `type`    | string | Yes      | custom:yet-another-media-player     |
| `entities`     | string | Yes       | List of your media player entities            |
| `actions`   | string | No      | Use any home assistant service here. Use "current" as the entity_id to target the currently selected media player    |
| `match_theme`| boolean | No | Updates the cards accent colors to match your home assistant theme |
| `collapse_on_idle` | boolean | No | When nothing is playing, card collapses to save space (great on mobile) | 
| `always_collapsed` | boolean | No | This will keep the card in collapsed or "mini" mode even when something is playing |
| `volume_entity` | string | No | Use this to specify a separate entity from the player to control volume |

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
  - media_player.bedroom
  - media_player.entryway_speaker
actions:
  - name: Soul
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.3cb881c4590341fabc374f003afaf2b4
      enqueue: replace
match_theme: true
volume_mode: slider
collapse_on_idle: true
always_collapsed: false
```

### Custom Actions
You can also set mdi icons in the custom actions. This helps differentiate between music related actions and tv related actions. 

```yaml
actions:
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


### Input Source Actions (Icon Only)
With [custom brand icons](https://github.com/elax46/custom-brand-icons) (also available on HACS), you can set up source actions with the providers logo.

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



---

## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)



---

## Support the project

Like having Yet Another Media Player? You can show your support with a coffee ☕️

<a href="https://www.buymeacoffee.com/jianyu_li" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 127px !important;" ></a>
