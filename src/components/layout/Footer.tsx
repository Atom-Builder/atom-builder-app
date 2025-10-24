import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react'; // Removed Twitter icon

// Team Member Data (Example)
const teamMembers = [
    {
        name: 'Arthur Berggård',
        role: 'Principal Systems Architect & Lead Developer',
        // avatarUrl: '/avatars/arthur.png', // Example path - replace with actual later
    },
    {
        name: 'Theo Hansson',
        role: 'User Experience & Gamification Specialist',
        // avatarUrl: '/avatars/theo.png',
    },
    {
        name: 'Muntadher Rafid Mansoor Al-Jasim',
        role: 'Lead Reasoning & Conceptual Analyst',
        // avatarUrl: '/avatars/muntadher.png',
    },
     {
        name: 'Google Gemini',
        role: 'AI Collaborator & Development Assistant',
        // avatarUrl: '/avatars/gemini.png', // Placeholder icon
    }
];

// Social Links Data
const socialLinks = [
    // { name: 'Twitter', Icon: Twitter, href: '#' }, // Removed Twitter
    { name: 'GitHub', Icon: Github, href: 'https://github.com/Atom-Builder/atom-builder-app' }, // Link to your repo
    // { name: 'LinkedIn', Icon: Linkedin, href: '#' }, // Add actual link if available
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800/50 text-gray-400 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* About Section */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="text-2xl font-bold font-orbitron text-cyan-400 mb-4 inline-block">
                            AtomBuilder
                        </Link>
                        <p className="text-sm leading-relaxed mb-4">
                            Build the universe, one atom at a time. Atom Builder is a futuristic educational web app
                            making science interactive, engaging, and fun. Developed collaboratively by humans and AI.
                             {/* Removed "Coming soon" and placeholder link */}
                        </p>
                    </div>

                    {/* Team Section */}
                    <div className="lg:col-span-5">
                        <h3 className="text-lg font-semibold font-orbitron text-gray-200 mb-4">Contributors</h3>
                        {/* --- Improved Layout: Flexbox for better wrapping --- */}
                        <div className="flex flex-wrap gap-6">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="flex items-center space-x-3 w-full sm:w-auto">
                                    {/* Placeholder Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-lg font-bold text-gray-900">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* --- End Layout Improvement --- */}
                    </div>

                    {/* Contact/Links Section */}
                    <div className="lg:col-span-3">
                         <h3 className="text-lg font-semibold font-orbitron text-gray-200 mb-4">Connect</h3>
                        <div className="space-y-3">
                             {/* Social Icons */}
                            <div className="flex space-x-4">
                                {socialLinks.map(({ name, Icon, href }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-cyan-400 transition-colors"
                                        aria-label={`Visit Atom Builder on ${name}`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                ))}
                                {/* Optional Contact Email */}
                                {/* <a href="mailto:contact@atombuilder.com" className="text-gray-500 hover:text-cyan-400 transition-colors">
                                    <Mail className="w-6 h-6" />
                                </a> */}
                            </div>
                            {/* You can add other links here if needed */}
                             {/* <Link href="/privacy" className="text-sm hover:text-gray-200 transition-colors">Privacy Policy</Link> */}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Atom Builder Contributors. All rights reserved.</p>
                     <p className="text-xs text-gray-600 mt-1">
                        Making science interactive and fun.
                    </p>
                </div>
            </div>
        </footer>
    );
}

