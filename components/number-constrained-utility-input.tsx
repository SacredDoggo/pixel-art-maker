import { Dispatch, SetStateAction } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface NumberConstrainedUtilityInputProps {
    data: number;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setData: Dispatch<SetStateAction<number>>;
}

export const NumberConstrainedUtilityInput = ({
    data,
    handleChange,
    setData
}: NumberConstrainedUtilityInputProps) => {
    return (
        <div className="flex items-center">
            <input
                type="number"
                value={data}
                onChange={handleChange}
                min={1}
                max={30}
                onKeyDown={(e) => e.preventDefault()}
                onWheel={(e) => e.currentTarget.blur()}
                className="p-1 rounded-sm text-sm bg-zinc-700 text-center focus:outline-none focus:ring-0 hide-spinner"
                readOnly={!handleChange}
            />

            <div className="flex flex-col">
                <button
                    onClick={() => setData((prev) => Math.min(prev + 1, 30))}
                    className="p-[1px] pb-0 rounded-t-md focus:outline-none focus:ring-0"
                >
                    <ChevronUpIcon className="h-4 w-4" />
                </button>

                <button
                    onClick={() => setData((prev) => Math.max(prev - 1, 1))}
                    className="p-[1px] pt-0 rounded-b-md focus:outline-none focus:ring-0"
                >
                    <ChevronDownIcon className="h-4 w-4" />
                </button>
            </div>
        </div>

    );
}