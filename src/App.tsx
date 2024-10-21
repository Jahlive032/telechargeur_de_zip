import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import JSZip from 'jszip';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = useCallback(async () => {
    if (!url) {
      setError('Veuillez entrer une URL valide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const blob = await response.blob();
      const zip = new JSZip();
      
      // Ajouter le fichier téléchargé au zip
      zip.file('downloaded_file.zip', blob);

      // Générer le zip
      const content = await zip.generateAsync({ type: 'blob' });

      // Créer un lien de téléchargement
      const downloadUrl = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'downloaded_file.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libérer la mémoire
      window.URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      setError('Une erreur est survenue lors du téléchargement');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Téléchargeur de Zip</h1>
        <div className="mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Entrez l'URL du fichier zip"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p>Bonjour</p>
        <button
          onClick={handleDownload}
          disabled={isLoading || !url}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition duration-200"
        >
          {isLoading ? (
            'Téléchargement...'
          ) : (
            <>
              <Download className="mr-2" size={20} />
              Télécharger
            </>
          )}
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default App;