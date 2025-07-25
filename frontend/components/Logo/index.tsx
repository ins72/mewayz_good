import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link className={`flex items-center gap-3 ${className || ""}`} href="/">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">MEWAYZ</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 -mt-1">V2</span>
                </div>
            </div>
        </Link>
    );
};

export default Logo;
