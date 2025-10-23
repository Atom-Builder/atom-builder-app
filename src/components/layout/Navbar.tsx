'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Settings, X, Menu, LogIn, LogOut, Loader2, User as UserIcon } from 'lucide-react'; // Added UserIcon
import { useAuth } from '@/hooks/useAuth';

export default function Navbar({ onSettingsClick }: { onSettingsClick: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth(); // Renamed loading to authLoading for clarity

    // Determine if the current user is anonymous or signed in with Google
    const isAnonymous = !authLoading && (!user || user.isAnonymous);
    const isSignedIn = !authLoading && user && !user.isAnonymous;

    const navLinks = [
        { name: 'Builder', href: '/builder' },
        { name: 'My Creations', href: '/creations' },
        { name: 'Periodic Table', href: '/#periodic-table' },
        { name: 'Knowledge Hub', href: '/#antimatter-hub' },
    ];

    const handleSignIn = async () => {
        await signInWithGoogle();
        setIsMenuOpen(false); // Close menu after sign-in attempt
    };

    const handleSignOut = async () => {
        await signOut();
        setIsMenuOpen(false); // Close menu after sign-out
    };


    return (
        <nav className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-lg border-b border-gray-800/50 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold font-orbitron text-cyan-400 hover:text-cyan-300 transition-colors">
                            AtomBuilder
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side buttons (Settings, Auth) */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            {/* Settings Button */}
                            <button
                                onClick={onSettingsClick}
                                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                                aria-label="Open graphics settings"
                            >
                                <Settings className="h-6 w-6" />
                            </button>

                            {/* Auth Button */}
                            {authLoading ? (
                                <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
                            ) : isSignedIn ? (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center bg-red-600/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-md text-sm font-medium border border-red-500/50 transition-colors"
                                    aria-label="Sign out"
                                >
                                    <LogOut className="h-5 w-5 mr-1" />
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    onClick={handleSignIn}
                                    className="flex items-center bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-2 rounded-md text-sm font-medium border border-cyan-500/50 transition-colors"
                                    aria-label="Sign in with Google"
                                >
                                    <LogIn className="h-5 w-5 mr-1" />
                                    Sign In
                                </button>
                            )}

                            {/* Optional: User Avatar/Icon if signed in */}
                            {isSignedIn && user?.photoURL && (
                                <img src={user.photoURL} alt="User avatar" className="h-8 w-8 rounded-full" />
                            )}
                             {isSignedIn && !user?.photoURL && (
                                <UserIcon className="h-8 w-8 rounded-full text-gray-400 bg-gray-700 p-1" />
                            )}

                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700/50`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={()=> setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>
                {/* Mobile Auth & Settings Buttons */}
                <div className="pt-4 pb-3 border-t border-gray-700/50">
                    <div className="flex items-center px-5 space-x-4">
                         {/* Settings Button */}
                         <button
                            onClick={() => { onSettingsClick(); setIsMenuOpen(false); }}
                            className="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                            aria-label="Open graphics settings"
                        >
                            <Settings className="h-5 w-5 mr-1" /> Settings
                        </button>

                       {/* Auth Button */}
                        {authLoading ? (
                             <div className="flex justify-center w-full">
                                <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
                            </div>
                        ) : isSignedIn ? (
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center bg-red-600/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-md text-sm font-medium border border-red-500/50 transition-colors"
                                aria-label="Sign out"
                            >
                                <LogOut className="h-5 w-5 mr-1" />
                                Sign Out
                            </button>
                        ) : (
                            <button
                                onClick={handleSignIn}
                                className="w-full flex items-center justify-center bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-2 rounded-md text-sm font-medium border border-cyan-500/50 transition-colors"
                                aria-label="Sign in with Google"
                            >
                                <LogIn className="h-5 w-5 mr-1" />
                                Sign In
                            </button>
                        )}
                    </div>
                     {/* User Info in Mobile */}
                     {isSignedIn && (
                        <div className="mt-3 px-5 flex items-center space-x-3">
                             {user?.photoURL ? (
                                <img src={user.photoURL} alt="User avatar" className="h-10 w-10 rounded-full" />
                            ) : (
                                <UserIcon className="h-10 w-10 rounded-full text-gray-400 bg-gray-700 p-1" />
                            )}
                            <div>
                                <div className="text-base font-medium leading-none text-white">{user?.displayName || 'User'}</div>
                                <div className="text-sm font-medium leading-none text-gray-400">{user?.email || ''}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

