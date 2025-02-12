import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface ItemProps {
    label: string;
    handleClick: () => void;
}

export const Item = ({ label, handleClick }: ItemProps) => {
    return (
        <DropdownMenuItem
            className="group relative hover:bg-[#3f3f3f] rounded-sm px-2 py-1 flex select-none items-center leading-none outline-none"
            onClick={handleClick}
        >
            {label}
        </DropdownMenuItem>
    );
}