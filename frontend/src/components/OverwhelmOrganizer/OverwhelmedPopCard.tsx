import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function OverwhelmedPopCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card className="relative rounded-[2rem] overflow-hidden max-w-5xl mx-auto text-white shadow-lg px-5 py-4">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-Fluiva-purple-950 bg-opacity-25 z-0"></div>
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7 }}
                        src="assets/banner.png"
                        className="w-full h-full object-cover z-0 opacity-100"
                    />
                </div>
                <div className="relative p-3 flex flex-col max-md:items-center">
                    <div className="absolute rounded-full blur-xl pointer-events-none"></div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-xl md:text-2xl lg:text-4xl font-bold mt-4 font-lilita-one uppercase tracking-widest relative"
                    >
                        <span className="hidden md:inline-block">Feeling</span>{" "}
                        Overwhelmed?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-sm md:text-base lg:text-lg mt-2 relative z-10 md:max-w-[80%] max-md:text-center"
                    >
                        We offer a shorter flow that helps you brainstorm what's
                        overflowing your mind and turn it into a a plan!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex justify-end mt-3 mb-2 z-10"
                    >
                        <Link to="/overwhelm-organizer">
                            <Button
                                variant="secondary"
                                className="px-10 font-bold text-md lg:text-xl"
                            >
                                Quick Plan!
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </Card>
        </motion.div>
    );
}
