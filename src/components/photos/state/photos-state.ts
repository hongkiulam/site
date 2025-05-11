import { map } from "nanostores";

export const photosState = map<{
  selectedProjectId?: number;
  selectedPhotoId?: number;
}>({
  selectedProjectId: undefined,
  selectedPhotoId: undefined,
});
