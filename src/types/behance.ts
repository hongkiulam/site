export interface BehanceProfileProject {
  __typename: string;
  colors: { r: number; g: number; b: number };
  covers: {
    [key in 'size_202' | 'size_404' | 'size_808']: { url: string } | null;
  };
  fields: { id: number; label: string; slug: string; url: string }[];
  id: number;
  modifiedOn: number;
  name: string;
  publishedOn: number;
  slug: string;
  url: string;
  allModules: AllModules;
}

export type AllModules = (ProjectImageModule | ProjectMediaCollectionModule)[];

interface ProjectImageModule {
  __typename: 'ImageModule';
  alignment: string;
  altText: string;
  altTextForEditor: string;
  caiData: string;
  hasCaiData: boolean;
  caption: string;
  captionAlignment: string;
  captionPlain: string;
  flexHeight: number;
  flexWidth: number;
  fullBleed: number;
  height: number;
  id: number;
  isCaiVersion1: boolean;
  projectId: number;
  src: string;
  tags: any[];
  width: number;
  imageSizes: ImageSizes;
}

interface ProjectMediaCollectionModule {
  __typename: 'MediaCollectionModule';
  alignment: string;
  captionAlignment: string;
  captionPlain: string;
  collectionType: string;
  components: {
    filename: string;
    flexHeight: number;
    flexWidth: number;
    height: number;
    id: number;
    imageSizes: ImageSizes;
    position: number;
    width: number;
  }[];
  id: number;
  fullBleed: number;
  sortType: string;
}
export type ImageSizes = {
  size_disp: ImageSize;
  size_fs: ImageSize;
  size_max_1200: ImageSize;
  size_1400_opt_1: ImageSize;
  size_2800_opt_1: ImageSize;
};
export interface ImageSize {
  height: number;
  url: string;
  width: number;
}
