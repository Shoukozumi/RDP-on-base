import Link from "next/link";

export default function Success() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        App Installed Successfully!
                    </h1>
                    <p className="mb-6">See all your apps.</p>
                    <Link href="/browse-actions" className="btn btn-primary">Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}