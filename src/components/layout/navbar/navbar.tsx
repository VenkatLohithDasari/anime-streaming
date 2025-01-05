// components/shared/navbar.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiHome,
    HiFilm,
    HiSearch,
    HiMenu,
    HiX
} from "react-icons/hi";
import SearchBox from '@/components/shared/search-box';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();
    const router = useRouter();

    const navigation = [
        { name: "Home", href: "/", icon: HiHome },
        { name: "Movies", href: "/movies", icon: HiFilm },
        { name: "TV Shows", href: "/tv-shows", icon: HiFilm },
    ];

    const isActivePath = (path: string) => {
        return pathname === path;
    };

    // const handleSearch = (e: FormEvent) => {
    //     e.preventDefault();
    //     if (searchQuery.trim()) {
    //         router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    //         setSearchQuery("");
    //     }
    // };

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-[99]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-white font-bold text-xl hover:text-gray-300 transition"
                        >
                            AnimeStreaming
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-2 ${isActivePath(item.href)
                                    ? "text-white"
                                    : "text-gray-300 hover:text-white"
                                    } transition-colors duration-200`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:block">
                        <SearchBox />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-neutral-800 transition-colors duration-200"
                        >
                            {isOpen ? (
                                <HiX className="h-6 w-6" />
                            ) : (
                                <HiMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Mobile Search */}
                            <div className="px-3 pb-2">
                                <SearchBox />
                            </div>

                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActivePath(item.href)
                                        ? "text-white bg-neutral-800"
                                        : "text-gray-300 hover:text-white hover:bg-neutral-800"
                                        } transition-colors duration-200`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;