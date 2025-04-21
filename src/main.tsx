
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wrap in StrictMode for better development experience
// and catch potential React issues
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error("Error rendering application:", error);
  // Show a simple error message on the page
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
      <h1>Something went wrong</h1>
      <p>The application failed to load. Please try refreshing the page.</p>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}
