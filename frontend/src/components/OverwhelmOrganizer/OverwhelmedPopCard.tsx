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
            <Card className="border-[3px] border-purple-500 relative rounded-xl overflow-hidden h-[25vh] flex items-center justify-center bg-purple-950 text-white shadow-lg">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-Fluiva-purple-950 bg-opacity-25 z-0"></div>
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7 }}
                        src="assets/overwhelmed.gif"
                        className="w-full h-full object-cover z-0 bg-purple-950 opacity-50"
                    />
                </div>
                <div className="relative p-3">
                    <div className="absolute inset-0 bg-black/30 rounded-full blur-xl pointer-events-none"></div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-3xl md:text-4xl lg:text-6xl font-bold mt-4 text-center font-lilita-one uppercase tracking-widest relative flex items-center justify-center"
                    >
                        Overwhelmed?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-sm md:text-base lg:text-lg text-center mt-2 relative z-10 max-w-[90%] md:max-w-[70%] m-auto"
                    >
                        We offer a shorter flow that helps you brainstorm what's
                        overflowing your mind and turn it into a a plan!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex justify-center mt-3 mb-2 z-10"
                    >
                        <Link to="/overwhelm-organizer">
                            <Button
                                variant="ghost"
                                className="border-Fluiva-purple-600 hover:text-Fluiva-purple-800 font-bold text-md lg:text-xl"
                            >
                                Let's Handle It{" "}
                                <ArrowRightCircle className="ml-2 h-6 w-6 inline-block" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </Card>
        </motion.div>
    );
}
