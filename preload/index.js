const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getAssets: () => ipcRenderer.invoke('get-assets'),
  addAsset: (data) => ipcRenderer.invoke('add-asset', data),
  deleteAsset: (id) => ipcRenderer.invoke('delete-asset', id),
});
