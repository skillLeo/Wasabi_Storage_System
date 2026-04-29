import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface BrandingTheme {
    brand_color?: string;
}

export function useBrandTheme() {
    const { branding } = usePage().props as { branding?: BrandingTheme };
    const brandColor = /^#[0-9A-Fa-f]{6}$/.test(branding?.brand_color ?? '')
        ? branding?.brand_color
        : '#2d6ea0';

    useEffect(() => {
        document.documentElement.style.setProperty('--brand-color', brandColor ?? '#2d6ea0');
    }, [brandColor]);

    return brandColor ?? '#2d6ea0';
}
