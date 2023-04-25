# Input Controls for Cantus

The following input controls are available in Cantus:

## Implemented features

### Navigation
- Use the `Arrow Left` and `Arrow Right` keys to navigate between characters in the input field.

### Syllable navigation
- Use the `Tab` key to jump to the next syllable in the input field.
- Use `Shift`+`Tab` to jump to the previous syllable.

### Line navigation
- Use the `Arrow Down` key to jump from the music line to the text line.
- Use the `Arrow Up` key to jump from the text line to the music line.
- Use the `Home` and `End` keys to jump to the beginning and the end of the line.

### Syllable editing
- Press the `Space` bar in a syllable or block of music to split the current syllable into two. If you press it at the end of a syllable or music block, the new syllable and music will be empty. If you press it in the middle of a music block, the music block will be split in half, and the new music block will have no text. If you press it in the middle of a syllable, the syllable will be split there, and the new syllable will have no music. If you press it at the beggining of a syllable or a music block, a new empty syllable with empty music will be added before the current syllable. The exception is that if the next element is empty in the field that you're editing (syllable or music block), but the opposing field is not empty, no new element will be added, but the next element will be the actively edited element.
- Press the `-` key in a syllable, and you'll achieve the same functionality you would with a `Space` bar press, but with a dash between the new syllables.
- Press `Ctrl`+`Space` to update the space between the current and next syllables, and jump to the next one.
- Press `Ctrl`+`-`  to update the dash between the current and next syllables, and jump to the next one.
- Press `Backspace` at the beginning of a syllable or a block of music to merge it with the previous one.
- Press `Ctrl`+`Backspace` to delete the currently selected syllable.
- Press `Enter` or `Esc` to exit the editing mode.

## Planned features

### Note editing
- Press `Ctrl`+`Arrow Up` or `Ctrl`+`Arrow Down` in the music line, and your notes will change their pitch.

### Line navigation
- Press the `Home` and `End` keys to jump to the beginning and the end of the line.

### Word editing
- Press `Ctrl`+`Delete` to delete a whole word.

### Document navigation
- Press `Ctrl`+`Home` to jump to the very beginning of the cantus.
- Press `Ctrl`+`End` to jump to the very end of the cantus.

These input controls allow users to easily navigate, edit, and manipulate the content of their Cantus document.
