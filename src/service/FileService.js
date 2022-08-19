import httpFiles from './httpFiles';

const apiEndPoint = '/files';

const FileService = {
    leerArchivo: (path) => httpFiles.request.post(`${apiEndPoint}/leerFile`, path),
};

export default FileService;