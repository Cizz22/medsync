export async function fetcher<T = any>([url, token]: [string, string]): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['token'] = token;
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include',
  });

  const body = await res.json();

  if (res.ok) {
    return body;
  }
  if (body.error) {
    throw new Error(body.error);
  }
  if (res.status > 399 && body.message) {
    throw new Error(body.message);
  }
  throw new Error('Unknown error when fetching');
}
