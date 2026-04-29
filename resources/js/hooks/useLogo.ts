import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function useLogo() {
    const [ts, setTs] = useState(() => Date.now());
    const { branding } = usePage().props as { branding?: { logo_url?: string } };

    useEffect(() => {
        function handler() { setTs(Date.now()); }
        window.addEventListener('logo-updated', handler);
        return () => window.removeEventListener('logo-updated', handler);
    }, []);

    const logoUrl = branding?.logo_url ?? '/logo.png';
    const separator = logoUrl.includes('?') ? '&' : '?';

    return `${logoUrl}${separator}client_v=${ts}`;
}
