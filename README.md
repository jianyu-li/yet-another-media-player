# Yet Another Media Player

Home Assistant Lovelace card for controlling multiple media players with chip-based switching and a customizable actions.

---

## Features

- Switch between multiple media players in a single card using chip-style selector
- Custom chip/entity names via YAML
- Optional full-card artwork background 
- Shuffle, repeat, and playback controls for compatible players
- Auto-switches to the active media player
- Action buttons run any Home Assistant service or script
- Use "current" for the entity_id to reference the currently selected media player (see example below)

---

## Screenshot


<img src="https://github.com/jianyu-li/yet-another-media-player/blob/main/images/screenshot1.png" width="500px" alt="Screenshot" />

*Example with multiple media players and custom actions

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
      media_id: apple_music://playlist/pl.5feba9fd5ea441a29aeb3597c8314384
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
artwork_background: false
volume_mode: slider
```
---

## Installation via HACS

[![Add to Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=yet-another-media-player&category=dashboard&owner=jianyu-li)

You can install **Yet Another Media Player** with HACS (Home Assistant Community Store):

1. Go to **HACS → Custom repositories**.
2. Add this repository URL:  
   `https://github.com/jianyu-li/yet-another-media-player`
3. Set category to **dashboard**.
4. Find and install the card from the list.
5. Refresh your browser, then add the card via the UI or YAML:

```yaml
type: custom:yet-another-media-player
entities:
  - media_player.your_player
  # ...
```

---



