import MediaCard from "./media-card";

interface Media {
    id: string;
    title: string;
    posterPath: string;
    mediaType: "anime" | "3d";
}

interface MediaGridProps {
    items: Media[];
    title?: string;
}

const MediaGrid = ({ items, title }: MediaGridProps) => {
    return (
        <section className="py-4 sm:py-8">
            {title && (
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map((item) => (
                    <MediaCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        posterPath={item.posterPath}
                        mediaType={item.mediaType}
                    />
                ))}
            </div>
        </section>
    )
}

export default MediaGrid;