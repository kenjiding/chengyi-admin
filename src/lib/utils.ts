export let messageApi: any = null;

export const initMessage = (api: any) => {
  messageApi = api;
};

export const getUrl = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }
  return 'http://localhost:3000' + path;
}
