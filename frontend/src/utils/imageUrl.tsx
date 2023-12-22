export function getImageUrl({
  person,
  size = "s",
}: {
  person: { imageId: string };
  size?: string;
}) {
  return "https://i.imgur.com/" + person.imageId + size + ".jpg";
}
