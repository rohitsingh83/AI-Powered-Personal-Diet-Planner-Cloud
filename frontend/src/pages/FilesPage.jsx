import { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      const res = await client.get('/storage/files');
      setFiles(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    try {
      await client.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("File securely uploaded to Cloud Vault!");
      fetchFiles();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = (fileId, fileName) => {
    client.get(`/storage/download/${fileId}`, { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'download');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success("File downloaded successfully");
      })
      .catch(() => toast.error("Failed to download file"));
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Permanently delete this file from cloud storage?")) {
      try {
        await client.delete(`/storage/files/${fileId}`);
        toast.success("File deleted from cloud storage");
        setFiles(files.filter(f => f.id !== fileId));
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
            <span>☁️</span> Object Storage Decoupling
          </div>
          <h1 className="text-3xl font-black text-slate-900">Cloud Health Records Vault</h1>
          <p className="text-sm text-slate-500">
            Securely upload blood test reports, clinical PDFs, and dietary logs with multi-tenant isolation.
          </p>
        </div>
        <div className="pill-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>🔒</span> Row-Level Isolated
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-emerald-300 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-8 sm:p-12 text-center hover:bg-emerald-100/50 hover:border-emerald-400 transition-all cursor-pointer group shadow-xs"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
          ☁️
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">
          Click to Upload Health Files
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
          Supported formats: <span className="font-semibold text-emerald-700">PDF, JPG, PNG</span> up to 10 MB.
        </p>

        {uploading ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold animate-pulse">
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Streaming to Cloud Object Vault...
          </div>
        ) : (
          <span className="btn-secondary text-xs px-4 py-2 bg-white">
            Select Document from Device
          </span>
        )}
      </div>

      {/* Files List */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>📁</span> Stored Cloud Objects ({files.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Decoupled from Relational DB</span>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving cloud file registry..." />
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <span className="text-4xl block">📂</span>
            <p className="text-sm font-medium">No medical files uploaded yet.</p>
            <p className="text-xs text-slate-400">Upload your PDF lab reports or dietary logs above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {files.map((file) => {
              const isPdf = file.content_type?.includes('pdf') || file.original_filename?.endsWith('.pdf');
              return (
                <div
                  key={file.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 -mx-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs ${
                      isPdf ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {isPdf ? '📄' : '🖼️'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 truncate max-w-xs sm:max-w-md">
                        {file.original_filename}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-500">{formatSize(file.file_size)}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(file.uploaded_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleDownload(file.id, file.original_filename)}
                      className="btn-secondary text-xs py-1.5 px-3 hover:text-emerald-700 hover:border-emerald-300"
                    >
                      Download ⬇
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 py-1.5 px-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
