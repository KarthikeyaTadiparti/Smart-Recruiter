function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 12l-6-6-6 6" />
            <path d="M18 20l-6-6-6 6" />
        </svg>
    )
}

export default Logo