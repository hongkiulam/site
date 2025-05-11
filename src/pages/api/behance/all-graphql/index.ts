import type {
  AllModules,
  BehanceProfileProject,
  ImageSizes,
  SanitisedBehancePhotographyProject,
} from "@@types/behance";
import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import { projectMock } from "../all-graphql/_projects";

const PHOTOGRAPHY_FIELD_ID = 73;

const getProfileProjects = async (after: string) => {
  const projectsQuery = fs.readFileSync(
    path.join(process.cwd(), "src/pages/api/behance/all-graphql/_projects.gql"),
    "utf-8"
  );
  const response = await fetch(
    "https://www.behance.net/v3/graphql?client_id=BehanceWebSusi1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: projectsQuery,
        variables: {
          username: "haydonlam",
          after,
        },
      }),
    }
  );
  return response;
};

const imagesFromAllModules = (allModules: AllModules) => {
  const imageSizes = [] as ImageSizes[];
  allModules.forEach((mod) => {
    if (mod.__typename === "ImageModule") {
      imageSizes.push(mod.imageSizes);
    }
    if (mod.__typename === "MediaCollectionModule") {
      imageSizes.push(...mod.components.map((comp) => comp.imageSizes));
    }
  });
  return imageSizes;
};

export const GET: APIRoute = (async () => {
  let allProjects: BehanceProfileProject[] = [];
  try {
    // if (process.env.NODE_ENV === "development") {
    if (true) {
      // TODO: pregenerate the data during build to speed things up
      allProjects = projectMock;
    } else {
      let after = Buffer.from("0").toString("base64");
      while (after) {
        const projectsRes = await getProfileProjects(after);

        if (!projectsRes.ok) {
          return new Response(
            JSON.stringify({
              error: "Failed to fetch from Behance API",
            }),
            {
              status: projectsRes.status,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        const data = (await projectsRes.json()).data;
        const pageInfo = data.user.profileProjects.pageInfo;
        const projects = data.user.profileProjects.nodes;
        allProjects.push(...projects);

        after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
      }
    }

    const sanitisedPhotographyProjects: SanitisedBehancePhotographyProject[] =
      allProjects
        .filter((project) => {
          return project.fields.some(
            (field) => field.id === PHOTOGRAPHY_FIELD_ID
          );
        })
        .map((project) => {
          const imageSizes = imagesFromAllModules(project.allModules);
          return {
            covers: project.covers,
            fields: project.fields,
            id: project.id,
            name: project.name,
            publishedOn: project.publishedOn,
            slug: project.slug,
            url: project.url,
            imageSizes,
          };
        });

    return new Response(JSON.stringify(sanitisedPhotographyProjects), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching Behance projects:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}) satisfies APIRoute;
