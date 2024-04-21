import React from 'react';
import './index.less';
import ExroApp from './ExroApp';
import { createRoot } from 'react-dom/client';
const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);
root.render(<ExroApp />);
