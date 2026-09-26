/**
 * The two page-turners, drawn in a common 120 × 100 box.
 *
 * Both fly leftward and hold the page at (8, 40): Crew.tsx puts that point on
 * the page's free edge in 3D, so whatever is drawn there is what grips the
 * paper — her hands, its claw. Everything else hangs off that point.
 *
 * Lighting follows the book's lamp: key light from the upper left, warm; the
 * far limbs, far wings and far rotors sit back in shade. Their own motion —
 * wingbeats, propellers, a strobe — runs on CSS clocks, so a flyer stays alive
 * when the scroll has stopped with the page held open in mid-air.
 */

/** Gradients for both models. Mounted once, by Crew. */
export const FlyerDefs = () => (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
            {/* ── Fairy ── */}
            <linearGradient id="bk-fay-skin" x1="0.2" y1="0" x2="0.5" y2="1">
                <stop offset="0" stopColor="#fbe3cf" />
                <stop offset="0.5" stopColor="#eab99a" />
                <stop offset="1" stopColor="#b47858" />
            </linearGradient>
            <linearGradient id="bk-fay-skin-far" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d9a283" />
                <stop offset="1" stopColor="#99604a" />
            </linearGradient>
            <linearGradient id="bk-fay-hair" x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0" stopColor="#6a3417" />
                <stop offset="0.45" stopColor="#b8672a" />
                <stop offset="0.8" stopColor="#e3a45a" />
                <stop offset="1" stopColor="#f4c98a" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="bk-fay-dress" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0" stopColor="#fbfcf6" />
                <stop offset="0.55" stopColor="#dfe8da" />
                <stop offset="1" stopColor="#a9bcae" />
            </linearGradient>
            <linearGradient id="bk-fay-wing" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.62" />
                <stop offset="0.35" stopColor="#d4f1ff" stopOpacity="0.36" />
                <stop offset="0.7" stopColor="#e6d4ff" stopOpacity="0.26" />
                <stop offset="1" stopColor="#ffd8ee" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="bk-fay-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffe2b0" stopOpacity="0.34" />
                <stop offset="0.5" stopColor="#ffc47a" stopOpacity="0.12" />
                <stop offset="1" stopColor="#ffb05a" stopOpacity="0" />
            </radialGradient>

            {/* ── Drone ── */}
            <linearGradient id="bk-bot-shell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6b7481" />
                <stop offset="0.28" stopColor="#3d444e" />
                <stop offset="0.75" stopColor="#23282f" />
                <stop offset="1" stopColor="#131619" />
            </linearGradient>
            <linearGradient id="bk-bot-metal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#eef1f4" />
                <stop offset="0.4" stopColor="#a4abb4" />
                <stop offset="1" stopColor="#4d535b" />
            </linearGradient>
            <linearGradient id="bk-bot-metal-far" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8e959e" />
                <stop offset="1" stopColor="#3a3f46" />
            </linearGradient>
            <linearGradient id="bk-bot-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2b4a6b" />
                <stop offset="0.45" stopColor="#0c1826" />
                <stop offset="1" stopColor="#050a10" />
            </linearGradient>
            <radialGradient id="bk-bot-prop" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#dde5ef" stopOpacity="0.04" />
                <stop offset="0.6" stopColor="#dde5ef" stopOpacity="0.16" />
                <stop offset="0.92" stopColor="#dde5ef" stopOpacity="0.28" />
                <stop offset="1" stopColor="#dde5ef" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bk-bot-led" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.35" stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

/**
 * A fairy in flight, leaning into the pull with both hands closed on the
 * page's edge. Two pairs of dragonfly wings, each with a faint after-image
 * of its own beat — which is how a fast wing actually reads to the eye.
 */
export const Fairy = () => (
    <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible bk-flyer-shadow" aria-hidden="true">
        <ellipse cx="62" cy="42" rx="48" ry="34" fill="url(#bk-fay-glow)" />

        {/* Far wings, behind her and in shade. */}
        <g opacity="0.5">
            <path
                className="bk-flap bk-flap-far"
                style={{ transformOrigin: '0% 100%' }}
                d="M57 35 C 63 21, 78 7, 94 6.5 C 102 6.5, 104 12.5, 97.5 17.5 C 86 26, 70 32.5, 57 35 Z"
                fill="url(#bk-fay-wing)"
            />
            <path
                className="bk-flap bk-flap-far"
                style={{ transformOrigin: '0% 8%' }}
                d="M58 38 C 70 37, 87 38.5, 99 43.5 C 104.5 46, 102 51.5, 95 51 C 82 49.5, 68 44.5, 58 38 Z"
                fill="url(#bk-fay-wing)"
            />
        </g>

        {/* Far leg, bent at the knee, trailing in shade. */}
        <path
            d="M67 48 C 73 52, 78 55, 82 57.6 C 85 59.6, 87.2 63, 89 67 C 90.6 70.2, 92.2 72.6, 95.4 74.6 C 93.6 75.6, 91 74.8, 89.4 73.4 C 87.4 71.6, 85.4 68.4, 83.2 65.2 C 81.2 62.3, 77 58.6, 70.5 54.6 Z"
            fill="url(#bk-fay-skin-far)"
        />

        {/* Far arm, reaching past her face to the page. */}
        <path
            d="M47.5 35.6 C 42 34.8, 37 34.8, 32 35.2 C 25.5 35.8, 18 36.4, 11.5 36.9 L 11.6 39 C 18 38.7, 25.5 38.4, 32 38.1 C 37 37.9, 42 38.3, 47.5 39.2 Z"
            fill="url(#bk-fay-skin-far)"
        />
        <path d="M11.8 36.4 C 9 36.2, 6.6 36.9, 6.2 38.6 C 6 39.8, 7.2 40.3, 8.6 39.9 C 10.4 39.5, 11.6 39.2, 12.4 39" fill="url(#bk-fay-skin-far)" />

        {/* Near leg, stretched out behind, toe pointed. */}
        <path
            d="M67.5 44.6 C 75.5 46.6, 82 49.6, 86.2 51 C 92 52.8, 97 53.8, 101 54.4 C 104 54.8, 106.2 54.3, 108.4 54.8 C 106.4 56.5, 103.2 57.1, 100.6 57.4 C 96 57.9, 91 57.5, 85.8 56.2 C 80.6 55, 74.8 53, 68.6 50.6 Z"
            fill="url(#bk-fay-skin)"
        />

        {/* Slip dress, cut on the bias, its hem streaming out behind. */}
        <path
            d="M46 36 C 50 32.8, 55 33.6, 58.2 36.8 C 61 39.6, 63.2 41.8, 66.2 42.8 C 72.4 44.4, 79.4 44.2, 86.8 45.8 C 83.4 47.4, 84.4 50.2, 88.8 52.8 C 82.4 53.2, 77.2 53.2, 73 55.4 C 69.8 53.4, 66 51.2, 62 49.6 C 57 47.6, 50.8 44.2, 46.8 41.2 C 44.8 39.6, 44.8 37.4, 46 36 Z"
            fill="url(#bk-fay-dress)"
        />
        <path d="M63.6 44.2 C 70 46.4, 76 48.4, 82.6 51.2" stroke="#8fa596" strokeWidth="0.5" fill="none" opacity="0.7" />
        <path d="M59.6 45.4 C 65.6 48.2, 69.8 50.4, 74 53.4" stroke="#8fa596" strokeWidth="0.45" fill="none" opacity="0.6" />
        <path d="M49 37 C 52.6 36.2, 56 37.4, 58.4 39.8" stroke="#ffffff" strokeWidth="0.7" fill="none" opacity="0.7" />

        {/* Neck, head in profile, facing the page. */}
        <path d="M44.6 32.6 L 48.6 35.4 L 46.4 37.8 L 43.2 35.2 Z" fill="url(#bk-fay-skin)" />
        <ellipse cx="40.8" cy="29" rx="5.9" ry="6.7" transform="rotate(-18 40.8 29)" fill="url(#bk-fay-skin)" />
        <path d="M35.8 27.6 C 34.4 28.6, 34.1 29.8, 35 30.5" stroke="#c98a6a" strokeWidth="0.55" fill="none" strokeLinecap="round" />
        <ellipse cx="37.6" cy="27.6" rx="0.85" ry="0.55" fill="#3a2418" />
        <circle cx="38.6" cy="30.6" r="1.4" fill="#e98a7a" opacity="0.28" />
        <path d="M36.6 32.9 C 37.6 33.4, 38.6 33.3, 39.2 32.8" stroke="#b86c5c" strokeWidth="0.45" fill="none" strokeLinecap="round" />

        {/* Hair: swept back by the flight, catching the lamp at the crown. */}
        <path
            d="M36 24.2 C 38.2 20.8, 44 20.2, 47.2 23 C 52 26, 58.4 26, 66 25 C 72 24.4, 78.4 26, 82.4 29.2 C 76.4 28.6, 71 29, 66 30.6 C 71.8 31, 77.2 33.6, 80.4 37.2 C 74.2 35, 68.2 34.2, 62 34.2 C 56 34.2, 51 33.2, 47.2 31.6 C 45.4 30.6, 44.4 28.4, 43 27 C 40.4 25.6, 38 25.6, 36 26.2 Z"
            fill="url(#bk-fay-hair)"
        />
        <path d="M40 22.6 C 46 22.4, 52 25.6, 60 26.8 C 66 27.6, 72 27, 78 28.4" stroke="#f6cf92" strokeWidth="0.55" fill="none" opacity="0.75" />
        <path d="M48 30.4 C 55 31.8, 63 32, 71 34.2" stroke="#f6cf92" strokeWidth="0.4" fill="none" opacity="0.55" />

        {/* Near arm, both hands on the page's edge at (8, 40). */}
        <path
            d="M48.2 38.4 C 43 39.4, 37 40.4, 31 40.9 C 25 41.4, 18 41.2, 12 40.9 L 12 43.2 C 18 43.4, 25 43.6, 31 43.4 C 37 43.2, 43 42.4, 48.2 41.6 Z"
            fill="url(#bk-fay-skin)"
        />
        <path d="M12.4 40.4 C 9.4 40.1, 6.8 40.9, 6.2 42.8 C 5.9 44.2, 7.2 44.8, 8.8 44.3 C 10.8 43.8, 12.2 43.5, 13 43.2" fill="url(#bk-fay-skin)" />
        <path d="M7.4 41.6 C 6.6 42.2, 6.4 43.1, 6.9 43.8" stroke="#b47858" strokeWidth="0.45" fill="none" />

        {/* Near wings, over the rest — each with a fainter after-image of its beat. */}
        {[
            { d: 'M55 34 C 60 19, 74 3, 90 1.5 C 98 1, 101 7, 95 12.5 C 84 22, 69 30, 55 34 Z', o: '0% 100%' },
            { d: 'M56 37 C 69 34, 88 33, 101 38 C 107 40.5, 105 46.5, 98 46.5 C 84 46, 68 42, 56 37 Z', o: '0% 28%' },
        ].map((w) => (
            <g key={w.d}>
                <path className="bk-flap bk-flap-ghost" style={{ transformOrigin: w.o }} d={w.d} fill="url(#bk-fay-wing)" opacity="0.35" />
                <path
                    className="bk-flap"
                    style={{ transformOrigin: w.o }}
                    d={w.d}
                    fill="url(#bk-fay-wing)"
                    stroke="#ffffff"
                    strokeOpacity="0.55"
                    strokeWidth="0.4"
                />
            </g>
        ))}
        <g className="bk-flap" style={{ transformOrigin: '0% 100%' }} opacity="0.4">
            <path d="M55 34 C 66 22, 78 11, 92 4.5 M57 33 C 70 25, 82 17, 97 9.5 M68 25 L 72 28.4 M78 17.5 L 83 20.6 M87 11 L 92 13.6" stroke="#ffffff" strokeWidth="0.32" fill="none" />
        </g>

        {/* Pollen shaken loose by the wings. */}
        <circle className="bk-spark" cx="92" cy="30" r="1.1" fill="#ffe2a8" />
        <circle className="bk-spark bk-spark-b" cx="100" cy="24" r="0.8" fill="#fff1d2" />
        <circle className="bk-spark bk-spark-c" cx="86" cy="42" r="0.9" fill="#ffd690" />
    </svg>
);

/**
 * A small camera quadcopter, carrying the page on a two-jointed arm with a
 * padded claw. Propellers read as blurred discs with a blade flickering
 * through them, the way a camera shutter catches a real one.
 */
export const Drone = () => (
    <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible bk-flyer-shadow" aria-hidden="true">
        {/* Far rotors, behind the hull. */}
        <path d="M66 32 L 52 21.5 M82 32 L 93 21.5" stroke="url(#bk-bot-metal-far)" strokeWidth="2.2" strokeLinecap="round" />
        {[52, 93].map((x) => (
            <g key={x} opacity="0.75">
                <rect x={x - 2.3} y="17.4" width="4.6" height="5" rx="1.2" fill="url(#bk-bot-metal-far)" />
                <ellipse cx={x} cy="16.8" rx="14" ry="2.5" fill="url(#bk-bot-prop)" />
                <ellipse className="bk-blade" cx={x} cy="16.8" rx="13" ry="0.55" fill="#dfe6ee" opacity="0.5" />
            </g>
        ))}

        {/* Far landing leg. */}
        <path d="M70 46 L 68 55 M80 46 L 83 55" stroke="url(#bk-bot-metal-far)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Hull. */}
        <path
            d="M52 38 C 52 33.4, 57 30.4, 64 30 L 84 30 C 91 30, 96 33.4, 96 38 C 96 42.6, 91 45.6, 84 46 L 64 46 C 57 45.6, 52 42.6, 52 38 Z"
            fill="url(#bk-bot-shell)"
            stroke="#0b0d10"
            strokeWidth="0.5"
        />
        <path d="M58 32.4 C 65 30.8, 80 30.6, 91 32.4 C 84 32.2, 66 32.6, 58 34.2 Z" fill="#ffffff" opacity="0.3" />
        <path d="M70 30.4 L 70 45.6 M81 30.4 L 81 45.6" stroke="#000000" strokeWidth="0.35" opacity="0.5" />
        <path d="M62.5 40.6 L 91 40.6 L 90 42.2 L 63.4 42.2 Z" fill="#e0521a" opacity="0.92" />
        {[84, 86.4, 88.8].map((x) => (
            <rect key={x} x={x} y="34" width="1.3" height="3.4" rx="0.6" fill="#0b0d10" opacity="0.8" />
        ))}

        {/* Sensor visor, forward. */}
        <path d="M52.6 37 C 53 33.8, 56.4 31.4, 61 31 L 62 31 C 60 33, 59.6 36, 60.6 39 L 53 39.6 C 52.6 38.8, 52.5 37.9, 52.6 37 Z" fill="url(#bk-bot-glass)" />
        <path d="M55 33.6 C 56.4 32.4, 58 31.8, 59.8 31.6" stroke="#9fd0ff" strokeWidth="0.55" fill="none" opacity="0.8" />

        {/* Gimbal camera, slung under the nose. */}
        <circle cx="60.5" cy="48.4" r="3.4" fill="#1a1e23" stroke="#050607" strokeWidth="0.4" />
        <circle cx="59.4" cy="48.6" r="1.7" fill="url(#bk-bot-glass)" />
        <circle cx="58.9" cy="48" r="0.5" fill="#bfe3ff" opacity="0.9" />

        {/* Near landing legs and skid. */}
        <path d="M66 46 L 62 56 M84 46 L 88 56 M58.5 56.3 L 91.5 56.3" stroke="url(#bk-bot-metal)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Near rotors, in front of the hull. */}
        <path d="M63 40 L 44 26.5 M86 40 L 103 26.5" stroke="url(#bk-bot-metal)" strokeWidth="2.9" strokeLinecap="round" />
        {[44, 103].map((x, i) => (
            <g key={x}>
                <rect x={x - 2.8} y="21.8" width="5.6" height="6.4" rx="1.4" fill="url(#bk-bot-metal)" stroke="#2c3036" strokeWidth="0.35" />
                <rect x={x - 1.2} y="20.6" width="2.4" height="1.6" rx="0.5" fill="#1a1d21" />
                <ellipse cx={x} cy="20.8" rx="16.5" ry="3.1" fill="url(#bk-bot-prop)" />
                <ellipse className={`bk-blade${i ? ' bk-blade-b' : ''}`} cx={x} cy="20.8" rx="15.4" ry="0.7" fill="#eef3f8" opacity="0.6" />
                <ellipse className={`bk-blade${i ? '' : ' bk-blade-b'}`} cx={x} cy="20.8" rx="15.4" ry="0.6" fill="#eef3f8" opacity="0.28" />
            </g>
        ))}

        {/* Navigation lights: green forward, red aft, a strobe on top. */}
        <circle cx="44" cy="28.6" r="2.4" fill="url(#bk-bot-led)" style={{ color: '#5cf29a' }} />
        <circle cx="103" cy="28.6" r="2.4" fill="url(#bk-bot-led)" style={{ color: '#ff4d3a' }} />
        <circle className="bk-blink" cx="75" cy="29.6" r="2.2" fill="url(#bk-bot-led)" style={{ color: '#ffffff' }} />

        {/* The arm: shoulder under the nose, elbow, wrist, claw closed on the page at (8, 40). */}
        <path d="M60 45 L 38 50 L 16.5 43" stroke="url(#bk-bot-metal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M56 47.6 L 40 51.4" stroke="#5a6069" strokeWidth="0.8" strokeLinecap="round" />
        {[
            { x: 60, y: 45, r: 2.1 },
            { x: 38, y: 50, r: 1.9 },
            { x: 16.5, y: 43, r: 1.7 },
        ].map((j) => (
            <g key={j.x}>
                <circle cx={j.x} cy={j.y} r={j.r} fill="url(#bk-bot-metal)" stroke="#2c3036" strokeWidth="0.4" />
                <circle cx={j.x} cy={j.y} r={j.r * 0.35} fill="#2c3036" />
            </g>
        ))}
        {/* Lower jaw sits behind the paper, so it is darker; the upper one is in front. */}
        <path d="M16 44 C 12.6 43.6, 10 42.6, 7.6 41.4" stroke="url(#bk-bot-metal-far)" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M16 42 C 12.4 39.6, 10 38.2, 6.8 38.6" stroke="url(#bk-bot-metal)" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <rect x="5.6" y="37.4" width="3.4" height="2.4" rx="1" fill="#e0521a" />
        <rect x="6" y="40.6" width="3" height="2" rx="0.9" fill="#a33a10" />
    </svg>
);
