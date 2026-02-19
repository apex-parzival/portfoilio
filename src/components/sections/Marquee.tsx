export const Marquee = () => {
    const text = 'MAKING GOOD SHIT SINCE 2021 • ';
    const repeated = text.repeat(10);

    return (
        <section className="py-8 overflow-hidden border-t border-b border-white/5">
            <div className="flex whitespace-nowrap animate-marquee">
                <span className="text-[6vw] md:text-[4vw] font-black uppercase tracking-[0.05em] text-cream/[0.07]">
                    {repeated}
                </span>
                <span className="text-[6vw] md:text-[4vw] font-black uppercase tracking-[0.05em] text-cream/[0.07]">
                    {repeated}
                </span>
            </div>
        </section>
    );
};
