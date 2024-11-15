// App.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PDFViewer from './PDFViewer';

const socket = io('http://localhost:4000'); // Replace with your server URL if different

function App() {
    const [pdfUrl, setPdfUrl] = useState(null); // URL of the selected PDF
    const [page, setPage] = useState(1);
    const [role, setRole] = useState(null); // Role: 'admin' or 'viewer'

    useEffect(() => {
        // Listen for page change and PDF URL events from the server
        socket.on('pageChange', (newPage) => {
            setPage(newPage);
        });
        socket.on('pdfUrlChange', (newPdfUrl) => {
            setPdfUrl(newPdfUrl);
        });

        // Clean up on component unmount
        return () => {
            socket.off('pageChange');
            socket.off('pdfUrlChange');
        };
    }, []);

    const changePage = (newPage) => {
        if (role === 'admin') {
            socket.emit('pageChange', newPage);
            setPage(newPage); // Update locally for the admin
        }
    };

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
    };

    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file && role === 'admin') {
            const fileUrl = URL.createObjectURL(file);
            setPdfUrl(fileUrl);
            socket.emit('pdfUrlChange', fileUrl); // Emit event to share with viewers
        }
    };

    if (!role) {
        return (
            <div>
                <h2>Select Your Role</h2>
                <button onClick={() => handleRoleSelection('admin')}>Admin</button>
                <button onClick={() => handleRoleSelection('viewer')}>Viewer</button>
            </div>
        );
    }

    return (
        <div>
            {role === 'admin' && (
                <div>
                    <input type="file" accept="application/pdf" onChange={handlePdfChange} />
                </div>
            )}
            {pdfUrl && (
                <PDFViewer pdfUrl={pdfUrl} page={page} />
            )}
            {role === 'admin' && (
                <div>
                    <button onClick={() => changePage(page - 1)} disabled={page <= 1}>Previous</button>
                    <button onClick={() => changePage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
}

export default App;
