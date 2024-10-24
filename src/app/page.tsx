import Link from "next/link";

const mockUrls = [
  "https://utfs.io/f/EtzqxYn2kxdSXwdBP9C380LVnCeSM19FrfYduBwGgIKckDtR",
  "https://utfs.io/f/EtzqxYn2kxdSNhhFJDc4WpSwz2gKU58EsR3HZGjmDNMvQAd6",
  "https://utfs.io/f/EtzqxYn2kxdSggouHGEtpo34NIvgwHAQXlnd8ZiFrfs95Kyx",
  "https://utfs.io/f/EtzqxYn2kxdSOC00GYimVaqTsScEvz7FkAM5UPNJyuGo0xfw"
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages, ...mockImages,].map((image) => (
          <div key={image.id} className="w-48">
            <img src={image.url} alt={`image-${image.id}`} />
          </div>
        ))}
      </div>
      <p>Website in progress</p> {/* Wrap "website in progress" inside a tag */}
    </main>
  );
}
