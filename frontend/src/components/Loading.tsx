export default function Loading() {
    return (
        <div className="w-full h-full min-h-[50vh] max-h-screen flex items-center justify-center">
            <img
                src="/assets/logo.png"
                width="80"
                height="80"
                className="animate-spin duration-300 opacity-50"
                alt="Loading..."
            />
        </div>
    );
}
