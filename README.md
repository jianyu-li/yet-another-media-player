# Yet Another Media Player

Home Assistant Lovelace card for controlling multiple media players with chip-based switching and a customizable actions.

---

## Features

- Switch between multiple media players in a single card using chips
- Custom chip/entity names via YAML
- Shuffle, repeat, and playback controls for compatible players
- Auto-switches to the active media player
- Action buttons run any Home Assistant service or script 
- Add icons to custom actions to differentiate types (e.g.: playlist versus tv script)
- Use "current" for the entity_id to reference the currently selected media player (see example below)

---

## Screenshot

![Preview Image](/images/preview3.png)



*Example with multiple media players and custom actions

![Preview Image Icons](/images/previewwithicons.png)

*Example with action icons and volume stepper

---

## Basic Usage

Add the card to your Lovelace dashboard using YAML (for custom chip/entity names) or the UI (for default entity names). 

You can use music assistant actions in conjunction with "current" as the entity id and it will target whatever the current entity that is displayed in the card (e.g.: genres)

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

## Notes

- When an entity is manually selected it will be pinned in place and will not auto-switch to the more recently playing entity for that session. Tap or click the pin icon that appears to unpin the entity.
- Entity names can be updated via YAML, but if you try and add a new entity through the ui then the YAML based entities disappear. It is recommended to either use the ui or YAML, but not both. 
- Actions can run any home assistant service, not just media services. Specifying "current" in the entity_id field will target the currently selected entity. 



---

## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)



---



