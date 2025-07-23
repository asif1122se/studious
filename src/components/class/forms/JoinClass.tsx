"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, closeModal, setRefetch } from "@/store/appSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { trpc } from "@/utils/trpc";
import { validate } from "@/lib/validation";

interface JoinClassOptions {
    onCreate: ()=>void;
}

export default function JoinClass({ onCreate }: JoinClassOptions) {
    const REQUIRED_KEYS = ['classCode']

    const [classCode, setClassCode] = useState<string>('');
    const dispatch = useDispatch();

    const {mutate: joinClass, isPending} = trpc.class.join.useMutation({
        onSuccess: (data) => {
            onCreate();
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: 'Joined class successfully' }));
            dispatch(setRefetch(true));
            dispatch(closeModal());
        },
        onError: (error) => {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
        },
    });

    const handleJoinClass = () => {
        const validated = validate(REQUIRED_KEYS, { classCode });
        console.log(validated)
        if (!validated.valid) return dispatch(addAlert({
            level: AlertLevel.WARNING,
            remark: validated.remark,
        }));

        joinClass({ classCode })
    }

    return (<div className="flex flex-col space-y-3">
        <div className="flex flex-row space-x-2 text-sm">
            <Input.Text
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Class code here..." />
            <Button.Primary onClick={handleJoinClass} isLoading={isPending}>Join</Button.Primary>
        </div>
    </div>);
}