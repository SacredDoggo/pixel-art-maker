"use client";

import { Switch, SwitchThumb } from "@radix-ui/react-switch";
import { Dispatch, SetStateAction } from "react";

interface SwitchUtilityButtonInterface {
    label?: string;
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>
}

export const SwitchUtilityButton = ({ label, checked, setChecked }: SwitchUtilityButtonInterface) => {
    return (
        <div className="flex gap-x-2 items-center">
            <span className="font-mono">{label ?? ""}</span>
            <Switch
                className="relative h-[20px] w-[36px] cursor-default rounded-full outline-none bg-teal-800 data-[state=checked]:bg-teal-500"
                checked={checked}
                onCheckedChange={setChecked}
            >
                <SwitchThumb className="block size-[18px] rounded-full bg-gray-300 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-white" />
            </Switch>
        </div>
    );
};