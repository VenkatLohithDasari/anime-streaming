import Link from "next/link";
import {
    HiHome,
    HiFilm,
    HiMail,
    HiInformationCircle,
    HiExclamationCircle
} from "react-icons/hi";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navigation = [
        { name: "Home", href: "/", icon: HiHome },
        { name: "Movies", href: "/movies", icon: HiFilm },
        { name: "TV Shows", href: "/tv-shows", icon: HiFilm },
    ];

    const legal = [
        { name: "About Us", href: "/about", icon: HiInformationCircle },
        { name: "Contact", href: "/contact", icon: HiMail },
        { name: "DMCA", href: "/dmca", icon: HiExclamationCircle },
    ];

    return (
        <footer className="mt-auto bg-neutral-900 border-t border-neutral-800">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legal.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Watch your favorite anime shows and movies in HD quality.
                            We provide a wide selection of content with regular updates.
                        </p>
                        <div className="mt-4 text-sm text-gray-500">
                            Disclaimer: This site does not store any files on its server.
                            All contents are provided by non-affiliated third parties.
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-gray-400">
                    <p>© {currentYear} Your StreamFlix. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;