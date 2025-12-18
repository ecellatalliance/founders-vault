const BrandShowcase = () => {
    const brands = [
        {
            name: 'Apple',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
        },
        {
            name: 'Dell',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg'
        },
        {
            name: 'Sony',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg'
        },
        {
            name: 'Microsoft',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
        },
        {
            name: 'Samsung',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
        },
        {
            name: 'HP',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg'
        },
        {
            name: 'Logitech',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Logitech_logo.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Logitech_logo.svg'
        },
        {
            name: 'Nike',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
            darkLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
        },
    ];

    return (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                Our Partner Brands
            </h2>

            {/* Horizontal Logo Row */}
            <div className="overflow-x-auto pb-2">
                <div className="flex items-center justify-center gap-12 min-w-max px-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex flex-col items-center justify-center group cursor-pointer"
                        >
                            <div className="h-12 w-24 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain dark:invert"
                                />
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {brand.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandShowcase;
