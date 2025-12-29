import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { galleryImages, getImageBySlug, titleToSlug } from "@/lib/gallery";
import type { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

interface PhotoPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const image of galleryImages) {
      params.push({
        locale,
        slug: titleToSlug(image.title),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { slug, locale } = await params as { slug: string; locale: Locale };
  const image = await getImageBySlug(slug);
  const t = getTranslations(locale);

  if (!image) {
    return {
      title: t.photo.notFoundTitle,
    };
  }

  return {
    title: image.title,
    description: `${image.alt} - ${image.category} photography by Denis Pek`,
    openGraph: {
      title: image.title,
      description: `${image.alt} - ${image.category} photography`,
      images: [
        {
          url: image.src,
          width: 800,
          height: 800,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: image.title,
      description: `${image.alt} - ${image.category} photography`,
      images: [image.src],
    },
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug, locale } = await params as { slug: string; locale: Locale };
  const image = await getImageBySlug(slug);
  const t = getTranslations(locale);

  if (!image) {
    notFound();
  }

  const relatedImages = galleryImages
    .filter((img) => img.category === image.category && img.id !== image.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t.photo.backToGallery}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-block">
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mb-4">
                {image.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {image.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">{image.alt}</p>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900 mb-2">
                {t.photo.details}
              </h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">{t.photo.category}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {image.category}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">{t.photo.photographer}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Denis Pek
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {relatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t.photo.moreFrom} {image.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedImages.map((relatedImage) => (
                <Link
                  key={relatedImage.id}
                  href={`/${locale}/photo/${titleToSlug(relatedImage.title)}`}
                >
                  <article className="group cursor-pointer">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={relatedImage.src}
                        alt={relatedImage.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {relatedImage.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {relatedImage.category}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Denis Pek. {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
