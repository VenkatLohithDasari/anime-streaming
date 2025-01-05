// app/api/episodes/[episodeId]/views/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Episode } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { episodeId: string } }
) {
    try {
        await connectToDatabase();

        const episode = await Episode.findOneAndUpdate(
            { episodeId: params.episodeId },
            { $inc: { views: 1 } },
            { new: true }
        ).select('views');

        if (!episode) {
            return NextResponse.json(
                { error: 'Episode not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            views: episode.views
        });

    } catch (error) {
        console.error('Error updating views:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}