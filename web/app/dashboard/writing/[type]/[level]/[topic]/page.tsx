"use client";

import { useParams, useRouter } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div>
                <h1>Writing Paragraph</h1>
                <p>Level: {params.level}</p>
                <p>Topic: {params.topic}</p>
            </div>
        </>
    );
}