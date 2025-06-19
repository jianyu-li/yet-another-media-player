# Yet Another Media Player

Home Assistant media card for controlling multiple entities with customizable actions.

---

## Features

- Switch between multiple media players in a single card using chips
- Custom chip/entity names via YAML
- Shuffle, repeat, and playback controls for compatible players
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

![Preview Image](/images/preview3.png)
![Preview Image Movie](/images/moviepreview.png)
![Preview Image One Entity](/images/preview_one_entity.png)
![Preview Image Collapsed](/images/miniplayerpreview.jpg)
![Preview Image Tv](/images/preview_tv.png)

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

```yaml
type: custom:yet-another-media-player
entities:
  - media_player.downstairs_2
  - media_player.kitchen_speaker_2
  - media_player.kitchen_homepod
  - media_player.living_room_apple_tv
  - media_player.bedroom
  - media_player.entryway_speaker
actions:
  - name: Grunge
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.5feba9fd5ea441a29aeb3597c8314384
      enqueue: replace
  - name: Alternative
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.ea843ef3098747f9815a77adf164e1fc
      enqueue: replace
  - name: Soul
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.3cb881c4590341fabc374f003afaf2b4
      enqueue: replace
  - name: Dinner
    service: music_assistant.play_media
    service_data:
      entity_id: current
      media_id: apple_music://playlist/pl.6a236667fbc046a49b48ea9cf4e8b639
      enqueue: replace
volume_mode: slider
match_theme: true
```

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

With [custom brand icons](https://github.com/elax46/custom-brand-icons) (also available on HACS), you can set up source actions with the providers logo.

```yaml
actions:
  - icon: phu:peacock
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Peacock
  - icon: phu:netflix
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Netflix
  - icon: phu:youtube
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Youtube
  - icon: phu:hulu
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Hulu
  - icon: phu:max
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Max
  - icon: phu:paramount
    service: media_player.select_source
    service_data:
      entity_id: current
      source: Paramount+   
```

You can update the name of the media player entity like the following. Be aware that customized entities via YAML will disappear if you had a new entity via the UI so it's recommended to keep using YAML if you have custom entities

```
entities:
  - entity_id: media_player.living_room_2
    name: Living
```

## Notes

- When an entity is manually selected it will be pinned in place and will not auto-switch to the more recently playing entity for that session. Tap or click the pin icon that appears to unpin the entity.
- Entity names can be updated via YAML, but if you try and add a new entity through the ui then the YAML based entities disappear. It is recommended to either use the ui or YAML, but not both. 
- Actions can run any home assistant service, not just media services. Specifying "current" in the entity_id field will target the currently selected entity. 



---

## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)



---

## Support the project

Like having Yet Another Media Player? You can show your support with a coffee ☕️

<a href="https://www.buymeacoffee.com/jianyu_li" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
