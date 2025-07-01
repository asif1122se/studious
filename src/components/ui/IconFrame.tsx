interface IconFrameProps {
    children: React.ReactNode;
    backgroundColor?: string; // Tailwind background color class
    baseColor?: string; // Tailwind text color class
    className?: string;
}

export default function IconFrame({ 
    children, 
    className,
    backgroundColor = 'bg-primary-100',
    // bg-primary-50 rounded-lg text-primary-600
    baseColor = 'text-primary-500'
}: IconFrameProps) {
    return (
        <div className={`flex size-12 shrink-0 ${backgroundColor} justify-center items-center ${baseColor} rounded-md text-lg ${className}`}>
            {children}
        </div>
    )
}
