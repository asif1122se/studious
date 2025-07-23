export default function Spinner () {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}