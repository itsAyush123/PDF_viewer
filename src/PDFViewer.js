// PDFViewer.js
import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

function PDFViewer({ pdfUrl, page }) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [currentPage, setCurrentPage] = useState(page);

    useEffect(() => {
        // Update currentPage whenever the page prop changes
        setCurrentPage(page);
    }, [page]);

    const handlePageChange = (e) => {
        // Handle internal page changes within the Viewer component
        setCurrentPage(e.currentPage + 1);
    };

    return (
        <div style={{ height: '750px', textAlign: 'center' }}>
            <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    onPageChange={handlePageChange}
                    initialPage={currentPage - 1} // Viewer is zero-indexed, so subtract 1
                />
            </Worker>
        </div>
    );
}

export default PDFViewer;
