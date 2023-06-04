import axios from 'axios';
import { HttpError, error, json } from '@sveltejs/kit';

const getProject = async (projectId: number) => {
  const q = await import.meta.glob('./*.gql', { as: 'raw' })['./project.gql']();
  const body = {
    query: q,
    variables: { projectId: projectId }
  };

  const response = await axios.post(
    'https://www.behance.net/v3/graphql?client_id=BehanceWebSusi1',
    body
  );
  return response.data;
};

export const GET = async ({ url }): Promise<Response | HttpError> => {
  const projectId = Number(url.searchParams.get('projectId') ?? '0');
  if (!projectId) {
    throw error(422, `Missing ?projectId= param`);
  }

  try {
    const projectsRes = await getProject(projectId);
    console.log(projectsRes);

    return json(projectsRes);
  } catch {
    return error(500);
  }
};

// Discovered this endpoint
// https://www.behance.net/v2/users/haydonlam/projects?client_id=BehanceWebSusi1
// But it only returns first 48 projects
// This was discovered by preserving network logs while logged in, and then on logging out
// a request is sent to this address for some reason 🤷

// Prior to this, the standard requests from the Behance projects webpage was to a graphql endpoint,
// but the response from the endpoint was `client or user required`
// However, after discovering the above endpoint I tried appending client_id=BehanceWebSusi1
// to the graphql endpoint and it works!
