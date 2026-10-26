// Picks up src/assets/feyide-house.(jpeg|jpg|png|webp) if present.
// Using a glob means the build does not fail while the file is missing.
const found = import.meta.glob('../assets/feyide-house.{jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const heroImage = Object.values(found)[0] || null;

if (!heroImage && import.meta.env.DEV) {
  console.warn('MY SAFETY: add the Feyide House photo at src/assets/feyide-house.jpeg');
}
