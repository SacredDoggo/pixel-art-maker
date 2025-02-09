interface ColourBoxProps {
    colour: string;
}

export const ColourBox = ({
    colour
}: ColourBoxProps) => {
    return (
        <div 
            className="colour-box h-8 w-8 shadow cursor-pointer border-2" 
            style={{ backgroundColor: colour }}
            data-colour={colour}
        ></div>
    );
}