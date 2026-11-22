/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VISIONEXA — EDIT-ME CONFIG
 *  The only two things you need to touch to finish the page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * 1) FESTIVAL DATE & TIME
 *
 * Leave as `null` until the date is final — the countdown then shows a clean
 * "date to be announced" state (no invented date).
 *
 * When you know it, use an ISO-8601 string WITH a timezone offset so every
 * visitor counts down to the same instant. India Standard Time is +05:30:
 *
 *   export const FESTIVAL_DATE: string | null = '2026-12-15T09:00:00+05:30';
 *
 * An unparseable string is treated the same as `null`.
 */
export const FESTIVAL_DATE: string | null = '2026-12-21T00:00:00+05:30';

/**
 * 2) GALLERY IMAGES (3D cube)
 *
 * Leave empty for now — the cube renders 4 designed "awaiting imagery" faces.
 *
 * Put photos in /public (e.g. /public/visionexa/01.jpg) and list them by their
 * public URL. Any number of images works; the cube cycles through all of them
 * (4 faces are shown at a time and re-skinned as it rotates).
 *
 *   export const GALLERY_IMAGES: GalleryImage[] = [
 *     { src: '/visionexa/01.jpg', alt: 'Opening ceremony', caption: 'Opening Ceremony' },
 *     { src: '/visionexa/02.jpg', alt: 'Hackathon floor' },
 *     { src: '/visionexa/03.jpg', alt: 'Robotics arena' },
 *     { src: '/visionexa/04.jpg', alt: 'Cultural night' },
 *   ];
 *
 * `alt` and `caption` are optional. If a path 404s, that face quietly falls
 * back to the empty-slot design instead of showing a broken image.
 */
export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [];
