/* Unofficial Google Drive API
 * Adapted Into Wrangler Style 
 */

const settings = require('../../settings.json');

const getAccessToken = () => {
    const { client_id, client_secret, refresh_token } = settings.gdrive.credential;
    const url = 'https://www.googleapis.com/oauth2/v4/token';
    const grant_type = 'refresh_token';

    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('client_secret', client_secret);
    params.append('refresh_token', refresh_token);
    params.append('grant_type', grant_type);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    })
        .then((res) => res.json())
        .then((data) => data.access_token);
};

const getFileId = async (folderId, path) => {
    let fileId = null;
    const paths = path.split('/');
    for (let i = 0; i < paths.length; i++) {
        const query = `name='${paths[i]}' and mimeType${i === paths.length - 1 ? ' !=' : '='} 'application/vnd.google-apps.folder' and trashed = false and '${fileId || folderId}' in parents`;
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
        const token = await getAccessToken();

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (data.files && data.files[0]) {
            fileId = data.files[0].id;
        } else {
            throw new Error(`File not found: ${path}`);
        }
    }
    return fileId;
};

const downloadFile = async (fileId) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const token = await getAccessToken();

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await res.text();
};

const updateFile = async (fileId, newContent) => {
    const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const token = await getAccessToken();

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/octet-stream',
        },
        body: newContent,
    });
    return await res.json();
};
const getDownloadUrl = async (fileId) => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const token = await getAccessToken();

  const res = await fetch(url, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });

  if (res.status === 200) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      return url;
  } else {
      throw new Error(`Could not generate download URL for file ID ${fileId}`);
  }
};

const listFiles = async (folderId) => {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed = false&fields=files(id,name,mimeType,createdTime,modifiedTime)`;
    const token = await getAccessToken();
  
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data.files;
  };



export { getAccessToken, getFileId, downloadFile, updateFile, listFiles, getDownloadUrl };
