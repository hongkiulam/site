import axios from 'axios';
import { HttpError, error, json } from '@sveltejs/kit';

const getProfileProjects = async (after: string) => {
  const q = await import.meta.glob('./*.gql', { as: 'raw' })['./projects.gql']();
  const body = {
    query: q,
    variables: { username: 'haydonlam', after }
  };

  const response = await axios.post(
    'https://www.behance.net/v3/graphql?client_id=BehanceWebSusi1',
    body
  );
  return response.data;
};

export const GET = async (): Promise<Response | HttpError> => {
  try {
    const allProjects = [];
    let after = Buffer.from('0').toString('base64');

    while (after) {
      const projectsRes = await getProfileProjects(after);
      const pageInfo = projectsRes.data.user.profileProjects.pageInfo;
      const projects = projectsRes.data.user.profileProjects.nodes;

      allProjects.push(...projects);
      after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    }
    return json(allProjects);
  } catch (err) {
    console.log(err);
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
