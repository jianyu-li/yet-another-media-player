/**
 * Parses a standard LRC (LyRiCs) string into an array of timed lyric objects.
 * Supports basic [mm:ss.xx] and [mm:ss:xx] formats.
 * 
 * @param {string} lrcString - The raw LRC text.
 * @returns {Array<{text: string, time: number}>} Array of parsed lyric lines.
 */
export function parseLrc(lrcString) {
  if (!lrcString || typeof lrcString !== 'string') return [];

  const lines = lrcString.split('\n');
  const parsedLyrics = [];

  // Regex to match [mm:ss.xx] or [mm:ss:xx]
  const timeRegex = /\[(\d{2,}):(\d{2})(?:[.:](\d{2,3}))?\]/g;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Check if it's a metadata tag like [ti:Title] and ignore it for rendering lines
    if (line.match(/\[[a-zA-Z]+:[^\]]+\]/) && !line.match(timeRegex)) {
      return;
    }

    let match;
    let text = line.replace(timeRegex, '').trim();

    // Find all time tags in the line (some lines have multiple tags for repeated sections)
    const timeTages = [];
    timeRegex.lastIndex = 0; // Reset regex state
    while ((match = timeRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const fractions = match[3] ? parseInt(match[3], 10) : 0;

      // Calculate fraction modifier based on length (xx vs xxx)
      const fractionModifier = match[3] ? (match[3].length === 3 ? 1000 : 100) : 1000;
      const timeInSeconds = (minutes * 60) + seconds + (fractions / fractionModifier);
      timeTages.push(timeInSeconds);
    }

    if (timeTages.length > 0) {
      timeTages.forEach(time => {
        parsedLyrics.push({ time, text });
      });
    } else {
      // Fallback for non-timed lines (might be plain text lyrics)
      // Push a null time to identify it as unsynced
      parsedLyrics.push({ time: null, text });
    }
  });

  // Sort by time (required because LRC can have out-of-order tags like [01:00.00][02:00.00] Chorus)
  // Non-timed lines stay at the end or maintain relative order.
  parsedLyrics.sort((a, b) => {
    if (a.time === null && b.time === null) return 0;
    if (a.time === null) return 1;
    if (b.time === null) return -1;
    return a.time - b.time;
  });

  return parsedLyrics;
}
