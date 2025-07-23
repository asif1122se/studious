"use client";

import { useState } from "react";
import { addAlert, closeModal } from "@/store/appSlice";
import { useDispatch } from "react-redux";
import { AlertLevel } from "@/lib/alertLevel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SUBJECT_OPTIONS, SECTION_OPTIONS } from "@/lib/commonData";
import { trpc } from "@/utils/trpc";
import { TRPCClientErrorLike } from "@trpc/client";
import { emitClassCreate } from "@/lib/socket";
import ColorPicker from "@/components/ui/ColorPicker";
import Spinner from "@/components/ui/Spinner";
import { validate } from "@/lib/validation";

interface CreateClassOptions {
    onCreate: () => void;
}

const REQUIRED_FIELD_KEYS = [
    'name',
    'subject',
    'section',
    'color',
]

export default function CreateClass({ onCreate }: CreateClassOptions) {
    const dispatch = useDispatch();

    const [classData, setClassData] = useState({
        name: '',
        subject: '',
        section: '',
        color: '#3B82F6'
    });

    const { mutate: createClass, isPending } = trpc.class.create.useMutation({
        onSuccess: (data) => {
            // Emit socket event for real-time update
            onCreate();
            emitClassCreate(data);
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: 'Class created successfully' }));
            dispatch(closeModal());
        },
        onError: (error: TRPCClientErrorLike<any>) => {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
        },
    });

    const handleCreateClass = async () => {
        const validated = validate(REQUIRED_FIELD_KEYS, classData);

        if (!validated.valid) {
            return dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: validated.remark,
            }))
        }

        setClassData({ name: '', subject: '', section: '', color: '#3B82F6' });

        createClass({
            ...classData,
        });
    }

    return (<div className="w-[30rem] max-w-full">
            <div className="w-full flex flex-col space-y-3 mt-4">
                <Input.Text
                    label="Name" 
                    type="text"
                    value={classData.name} 
                    onChange={(e) => setClassData({ ...classData, name: e.target.value })} />
                <Input.SearchableSelect
                    label="Subject"
                    value={classData.subject}
                    searchList={SUBJECT_OPTIONS}
                    onChange={(e) => setClassData({ ...classData, subject: e.target.value })} />
                <Input.SearchableSelect
                    label="Section"
                    value={classData.section}
                    searchList={SECTION_OPTIONS}
                    onChange={(e) => setClassData({ ...classData, section: e.target.value })} />
                <ColorPicker
                value={classData.color}
                onChange={(color) => setClassData({...classData, color})}
                    />
            </div>
            <Button.Primary className="mt-5" isLoading={isPending} onClick={handleCreateClass}>
                {isPending ? 'Creating...' : 'Create'}
            </Button.Primary>
    </div>)
}