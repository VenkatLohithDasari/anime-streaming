import Image from "next/image";
import MediaGrid from "@/components/ui/media-grid";
import { getRecentEpisodes, getPopularAnime } from '@/lib/db-utils';


const mockData = [
	{
		id: "1",
		title: "Movie 1",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "2",
		title: "Movie 2",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "3",
		title: "Movie 3",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "4",
		title: "Movie 4",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "5",
		title: "Movie 5",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "6",
		title: "Movie 6",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "7",
		title: "Movie 7",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "8",
		title: "Movie 8",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "9",
		title: "Movie 9",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "10",
		title: "Movie 10",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "11",
		title: "Movie 11",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	},
	{
		id: "12",
		title: "Movie 12",
		posterPath: "https://picsum.photos/1000/1500",
		mediaType: "movie"
	}
]


export default async function Home() {
	const recentEpisodes = await getRecentEpisodes(12);

	return (
		<>
			<div className="space-y-8">
				<MediaGrid
					title="Recent Episodes"
					items={recentEpisodes
						.filter(episode => episode.animeId) // Only episodes with associated anime
						.map(episode => ({
							id: episode.episodeId,
							title: `${episode.animeId.name} - Episode ${episode.episodeNumber}`,
							posterPath: episode.animeId.poster, // Using anime's poster
							mediaType: "anime",
							views: episode.views
						}))}
				/>
			</div>
		</>
	);
}
