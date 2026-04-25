import { useState, useEffect } from 'react';

export function useLogo() {
    const [ts, setTs] = useState(() => Date.now());

    useEffect(() => {
        function handler() { setTs(Date.now()); }
        window.addEventListener('logo-updated', handler);
        return () => window.removeEventListener('logo-updated', handler);
    }, []);

    return `/logo.png?v=${ts}`;
}
