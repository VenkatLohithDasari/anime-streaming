// app/api/search/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Episode } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');
        const limit = Number(searchParams.get('limit')) || 5;

        if (!query) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const episodes = await Episode.find({
            displayTitle: { $regex: query, $options: 'i' }
        })
            .select('episodeId displayTitle thumbnail duration')
            .sort({ updateDate: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            results: episodes
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}