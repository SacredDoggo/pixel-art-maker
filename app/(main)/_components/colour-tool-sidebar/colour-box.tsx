interface ColourBoxProps {
    id: number;
    colour: string
}

export const ColourBox = ({
    id,
    colour
}: ColourBoxProps) => {
    return (
        <div 
            className="colour-box h-8 w-8 shadow cursor-pointer border-2" 
            style={{ backgroundColor: colour }}
            data-colour={colour}
            data-colour-id={id}
        ></div>
    );
}