import {Post} from "@/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/lib/services/users.service";
import {toast} from "sonner";
import {postService} from "@/lib/services/posts.service";

export function usePostActions(post: Post) {
	const queryClient = useQueryClient();

	const followMutation = useMutation({
		mutationFn: (following: boolean) =>
			following ? userService.unfollow(post.username) : userService.follow(post.username),

		onMutate: async (following) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] });
			const previousPosts = queryClient.getQueryData(['posts']);

			queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
				if (!old) return old;
				return old.map((p) =>
					p.username === post.username ? { ...p, is_followed: !following } : p
				);
			});
			return { previousPosts };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
			toast.error("Échec de l'abonnement.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	});

	const likeMutation = useMutation({
		mutationFn: () => post.is_liked ? postService.unlike(post.id) : postService.like(post.id),

		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['posts'] });
			await queryClient.cancelQueries({ queryKey: ['topPosts'] });

			const previousPosts = queryClient.getQueryData(['posts']);

			queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
				if (!old) return old;
				return old.map((p) =>
					p.id === post.id
						? { ...p, is_liked: !p.is_liked, likes: p.is_liked ? p.likes - 1 : p.likes + 1 }
						: p
				);
			});
			return { previousPosts };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['posts'], context?.previousPosts);
			toast.error("Échec du like.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.invalidateQueries({ queryKey: ['topPosts'] });
		}
	});

	return {
		isLiked: post.is_liked,
		likes: post.likes,
		isFollowing: post.is_followed,
		toggleFollow: () => followMutation.mutate(post.is_followed || false),
		toggleLike: () => likeMutation.mutate(),
		isPending: likeMutation.isPending || followMutation.isPending
	};
}