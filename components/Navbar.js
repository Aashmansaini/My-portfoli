import Link from 'next/link';
import GlowCard from './GlowCard';

const navItems = [
    ['Experience', '#experience'],
    ['Skills', '#skills'],
    ['Credentials', '#credentials'],
    ['Contact', '#contact'],
];

export default function Navbar() {
    return (
        <GlowCard as="header" className="navbar" contentClassName="navbar-content" noCardStyle style={{ position: "fixed" }}>
            <Link href="#home" className="logo" aria-label="Go to home">
                <span className="logo-mark" />
                <span>Aashman Saini</span>
            </Link>

            <nav className="nav-links" aria-label="Main navigation">
                {navItems.map(([label, href]) => (
                    <Link key={label} href={href}>
                        {label}
                    </Link>
                ))}
            </nav>
        </GlowCard>
    );
}