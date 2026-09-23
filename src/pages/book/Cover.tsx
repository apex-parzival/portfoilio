import { profile } from '../../data/profile';
import { Device, Filigree } from './primitives';

/**
 * The front board. Its layers sit at different depths (translateZ), so when
 * the book tilts the foil title visibly floats above the cloth.
 */
export const CoverFace = () => (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-[3px_7px_7px_3px] bk-cloth shadow-[0_2px_0_rgba(255,255,255,0.05)_inset]" />
        <div className="absolute inset-0 rounded-[3px_7px_7px_3px] bk-cloth-weave" />
        {/* Hinge crease where the board flexes. */}
        <div className="absolute inset-y-0 left-[18px] w-[3px] bg-gradient-to-r from-black/60 via-white/[0.06] to-black/40" />

        <div
            className="absolute inset-[30px] left-[40px] rounded-[3px] bk-emboss"
            style={{ transform: 'translateZ(4px)' }}
        />
        <div
            className="absolute inset-[37px] left-[47px] rounded-[2px] border border-[#d9b56c]/25"
            style={{ transform: 'translateZ(8px)' }}
        />

        <div className="absolute inset-[42px] left-[52px]" style={{ transform: 'translateZ(14px)' }}>
            <Filigree className="absolute top-0 left-0 w-[62px]" />
            <Filigree className="absolute top-0 right-0 w-[62px] scale-x-[-1]" />
            <Filigree className="absolute bottom-0 left-0 w-[62px] scale-y-[-1]" />
            <Filigree className="absolute bottom-0 right-0 w-[62px] scale-[-1]" />
        </div>

        <div
            className="absolute inset-x-[40px] left-[46px] top-[96px] text-center bk-serif"
            style={{ transform: 'translateZ(20px)' }}
        >
            <div className="bk-foil bk-caps text-[10.5px] tracking-[0.34em]">A Portfolio in Seven Chapters</div>
        </div>

        <div
            className="absolute inset-x-[40px] left-[46px] top-[176px] text-center bk-serif"
            style={{ transform: 'translateZ(38px)' }}
        >
            <div className="bk-foil text-[66px] italic leading-[0.9] font-medium">Selected</div>
            <div className="bk-foil bk-caps text-[40px] leading-none tracking-[0.3em] font-medium mt-2 pl-[0.3em]">
                Work
            </div>
        </div>

        <div
            className="absolute left-[180px] top-[360px] w-[92px]"
            style={{ transform: 'translateZ(26px)' }}
        >
            <Device className="w-full" ink="url(#bk-foil-grad)" />
        </div>

        <div
            className="absolute inset-x-[40px] left-[46px] bottom-[86px] text-center bk-serif"
            style={{ transform: 'translateZ(20px)' }}
        >
            <div className="bk-foil bk-caps text-[12px] tracking-[0.3em]">{profile.name}</div>
            <div className="bk-foil text-[13px] italic mt-1.5 opacity-80">Backend &amp; AI/ML</div>
        </div>

        {/* Board sheen: sweeps once on arrival, then tracks the tilt via --shine. */}
        <div className="absolute inset-0 rounded-[3px_7px_7px_3px] bk-sheen pointer-events-none" />
        <div className="absolute inset-0 rounded-[3px_7px_7px_3px] bk-sheen bk-sheen-arrive pointer-events-none" />
    </div>
);
