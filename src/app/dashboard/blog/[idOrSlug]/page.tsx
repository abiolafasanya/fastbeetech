import EditPostPageClient from "./EditPostPageClient";

type PageParams = { idOrSlug: string };

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { idOrSlug } = await params;
  return <EditPostPageClient idOrSlug={idOrSlug} />;
}
