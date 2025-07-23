"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, closeModal, setRefetch } from "@/store/appSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { trpc } from "@/utils/trpc";
import { emitSectionCreate } from "@/lib/socket";
import { validate } from "@/lib/validation";
export default function CreateSection({ classId }: Readonly<{
    classId: string,
}>) {
    const REQUIRED_KEYS = ['sectionName'];
    const [name, setName] = useState<string>('');
    const dispatch = useDispatch();

    const {mutate: createSection, isPending} = trpc.section.create.useMutation({
        onSuccess: (section) => {
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Section created successfully" }));
            emitSectionCreate(classId, section);
            setName('');
            dispatch(closeModal());
        },
        onError: (error: any) => {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
        }
    });

    const handleCreateSection = () => {
        const validated = validate(REQUIRED_KEYS, { sectionName: name });

        if (!validated.valid) return addAlert({
            level: AlertLevel.WARNING,
            remark: validated.remark,
        });

        createSection({
            classId,
            name
        });
    }
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-2">
                <Input.Text
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Section name here..."
                />
                <Button.Primary onClick={handleCreateSection} isLoading={isPending}>Create</Button.Primary>
            </div>
        </div>
    );
}