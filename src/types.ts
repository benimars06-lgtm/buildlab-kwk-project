export type CommunityPageProps = {
  params: Promise<{ communitySlug: string }>;
};

export type PostPageProps = {
  params: Promise<{ communitySlug: string; postId: string }>;
};
