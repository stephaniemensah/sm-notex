# SM Notex

A simple note-taking app for students. All notes are saved in the browser's local storage.

## Features

- **Landing Page:** A simple page that invites students to start adding notes.
- **Rich Text Editor:** Full-page editor with auto-save on every keystroke. Supports links, images, and YouTube videos.
- **Notes List:** A page showing all saved notes. Clicking a note opens it in the same editor.
- **Delete Note:** When a note is opened, a delete button appears to remove it.
- **AI Assistant:** An AI button on top of the editor helps organize content in the rich text field.

## Tech Stack

- **Framework:** Nuxt 3 (Vue 3)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## File Naming

- Use `kebab-case` for all files (components, composables, utils, etc.)
- Example: `user-profile.vue`, `use-auth.ts`, `format-date.ts`

## Project Structure

- Keep files organized by feature or type
- Components go in `components/`
- Composables go in `composables/`
- Utilities go in `utils/`
- Pages go in `pages/`
- Types go in `types/`

## Code Principles

- **DRY:** Do not repeat yourself. Extract reusable logic into composables or utilities.
- **Single Responsibility:** Each file, component, and function should do one thing well.
- **Keep it simple:** Avoid over-engineering. Solve the problem directly.

## Documentation

- Do not create unnecessary markdown files. Only create when it adds clear value.
- README.md in root should contain only installation and setup info.
- No emojis in markdown files.
- Content must be concise, short, and easy to read.
- Do not duplicate similar markdown files.
