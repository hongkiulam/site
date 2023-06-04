import type { AllModules, ImageSizes } from '$types/behance';

export const imagesFromAllModules = (allModules: AllModules) => {
  const imageSizes = [] as ImageSizes[];
  allModules.forEach((mod) => {
    if (mod.__typename === 'ImageModule') {
      imageSizes.push(mod.imageSizes);
    }
    if (mod.__typename === 'MediaCollectionModule') {
      imageSizes.push(...mod.components.map((comp) => comp.imageSizes));
    }
  });
  return imageSizes;
};

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return formattedDate;
};
