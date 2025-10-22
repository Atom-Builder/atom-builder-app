import { Github, Twitter, Send } from 'lucide-react';
import React from 'react';

// Team member placeholder component
const TeamMember = ({ name, role }: { name: string, role: string }) => (
    <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-cyan-900/50 border-2 border-cyan-500/30 mx-auto mb-2 flex items-center justify-center">
            <span className="text-3xl text-cyan-400 opacity-50">⚛</span>
        </div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-gray-400">{role}</p>
    </div>
);

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-cyan-500/20 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold font-orbitron mb-4 text-cyan-400">About Atom Builder</h3>
                        <p className="text-gray-400">
                            Our mission is to make science education immersive, interactive, and inspiring. 
                            Atom Builder is a futuristic web app designed to let you build the universe, one atom at a time.
                        </p>
                    </div>

                    {/* Team Section */}
                    <div>
                        <h3 className="text-xl font-bold font-orbitron mb-4 text-cyan-400">The Team</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            <TeamMember name="Arthur Berggård" role="Principal Systems Architect & Lead Developer" />
                            <TeamMember name="Theo Hansson" role="Director of Interactive Experience" />
                            <TeamMember name="Muntadher Al-Jasim" role="Head of Cognitive Analysis" />
                            <TeamMember name="Gemini" role="Generative Systems Collaborator" />
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-xl font-bold font-orbitron mb-4 text-cyan-400">Get in Touch</h3>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your email for updates..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-cyan-400">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider and Final Footer */}
                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                        &copy; {new Date().getFullYear()} Atom Builder. All Rights Reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                         <p className="text-gray-600 text-xs italic">Developed with the help of Gemini</p>
                        <a href="https://github.com/programmerarthur" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400"><Github size={20}/></a>
                        <a href="#" className="text-gray-500 hover:text-cyan-400"><Twitter size={20}/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

