export default function Loading() {

    return (
      <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center">
        <img 
          src="/assets/logo.png"
          width="100"
          height="100"
          className="animate-spin"
          alt="Loading..."
        />
      </div>
    )
}