import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { desc } from "drizzle-orm/expressions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const imagesData = await db
    .select()
    .from(images)
    .orderBy(desc(images.id));

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {/* Repeating imagesData multiple times to show the sequence */}
        {[...imagesData, ...imagesData, ...imagesData, ...imagesData, ...imagesData].map((image, index) => (
          <div key={`${image.id}-${index}`} className="w-48 flex flex-col">
            <img src={image.url} alt={`image-${image.id}`} />
            <div>{image.name}</div>
          </div>
        ))}
      </div>
      <p>Website in progress</p>
    </main>
  );
}
