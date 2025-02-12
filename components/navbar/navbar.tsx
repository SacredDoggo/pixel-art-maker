import { NavbarItemFile } from "./navbar-item-file";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 h-6 w-full flex items-center text-xs border-b-[1px] p-2 z-[99999]">
            <NavbarItemFile />
        </nav>
    );
}