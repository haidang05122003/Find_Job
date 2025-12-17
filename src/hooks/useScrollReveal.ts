import { useEffect, useRef } from "react";
import { useAnimation, useInView } from "framer-motion";

export const useScrollReveal = (threshold = 0.1, once = true) => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, amount: threshold });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else if (!once) {
            controls.start("hidden");
        }
    }, [controls, inView, once]);

    return { ref, controls };
};
