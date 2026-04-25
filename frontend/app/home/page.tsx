'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/lib/services/posts.service";
import PostComposer from "@/components/ui/PostComposer";
import PostCard from "@/components/ui/PostCard";

export default function FeedPage() {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getFeed(),
  });

  const { data: topPosts = [], isLoading: isTopLoading } = useQuery({
    queryKey: ['topPosts'],
    queryFn: () => postService.getTop10(),
  });

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['topPosts'] });
  };

  const isLoading = isPostsLoading || isTopLoading;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <PostComposer onPostCreated={handlePostCreated} />

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-4">
            Récents
            <div className="h-px flex-1 bg-stone-200" />
          </h2>

          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100" />
                  <div className="flex-1 space-y-3 mt-1">
                    <div className="h-3 bg-stone-100 rounded w-1/4" />
                    <div className="h-3 bg-stone-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="card p-16 text-center border-dashed">
              <p className="text-stone-400 italic">
                Personne d{"'"}autre n{"'"}a posté de Rippl pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 lg:block">
        <aside className="sticky top-28 space-y-6">
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-stone-50/50">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <span className="text-rippl-600">#</span> Top Rippls
              </h3>
            </div>

            <div className="divide-y divide-stone-100">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="p-5 animate-pulse">
                    <div className="h-4 bg-stone-100 w-3/4 mb-2 rounded" />
                    <div className="h-3 bg-stone-100 w-1/2 rounded" />
                  </div>
                ))
              ) : topPosts.length > 0 ? (
                topPosts.map((tp, idx) => (
                  <button
                    key={tp.id}
                    className="w-full text-left p-5 transition-all duration-200 hover:bg-rippl-50/50 group"
                  >
                    <div className="flex items-start gap-4">
                      <span className={`
                        text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shrink-0
                        ${idx === 0 ? "bg-amber-100 text-amber-700" :
                        idx === 1 ? "bg-stone-100 text-stone-600" :
                          "bg-orange-50 text-orange-600"}
                      `}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-700 text-sm line-clamp-2 leading-relaxed group-hover:text-rippl-900">
                          {tp.content}
                        </p>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide truncate">
                            @{tp.username}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rippl-600 bg-rippl-50 px-2 py-0.5 rounded-full">
                            ♥ {tp.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-5 text-stone-400 text-sm text-center">Aucun post tendance</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}