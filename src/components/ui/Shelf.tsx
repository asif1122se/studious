"use client";

import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import React from "react";
import Button from "./Button";
import Empty from "../Empty";
import Card from "./Card";

interface ShelfProps {
    label: React.ReactNode | string;
    content?: React.ReactNode;
    children: React.ReactNode;
}

const Shelf: React.FC<ShelfProps> = ({ label, content, children }) => {
    const [opened, setOpened] = useState(false);
    const hasChildren = React.Children.count(children) > 0;

    return (
        <Card className="flex flex-col space-y-1 select-none px-3 py-0 h-full">
            <div className="flex justify-between py-1">
                <div 
                    className="flex flex-row space-x-4 items-center cursor-pointer" 
                >
                    {opened ? (
                        <Button.SM onClick={() => setOpened(!opened)}><BiChevronDown /></Button.SM>
                    ) : (
                        <Button.SM onClick={() => setOpened(!opened)}><BiChevronRight /></Button.SM>
                    )}
                    <div className="flex flex-col space-y-2">
                        <a className="font-bold text-foreground transition-colors duration-200 ease-in-out">
                            {label}
                        </a>
                    </div>
                </div>
                {content && content}
            </div>
            {opened && (
                <div className="flex-1 overflow-y-auto ml-8 pb-5">
                    {hasChildren ? children : (
                        <div className="py-2">
                            <Empty message="No items available" />
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default Shelf;