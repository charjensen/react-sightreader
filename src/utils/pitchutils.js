export const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const SILENCE = '-';

export function midiNumberToOctave(number) {
  return Math.floor(number / 12) - 1;
}

export function midiNumberToScale(number) {
  return scales[number % 12];
}

export function midiNumberToString(number) {
  if (!number) {
    return SILENCE;
  }
  return midiNumberToScale(number) + midiNumberToOctave(number);
}
