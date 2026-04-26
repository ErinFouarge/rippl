type PostHeaderProps = {
	username: string;
	date: string;
	isFollowing: boolean;
	onToggleFollow: () => void;
}

export const PostHeader = ({ username, date, isFollowing, onToggleFollow }: PostHeaderProps) => {

	return (
		<div className="flex items-start gap-4 mb-4">
			<div className="w-12 h-12 bg-rippl-100 text-rippl-600 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
				{username?.[0]?.toUpperCase() || "U"}
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-3">
					<h4 className="font-semibold text-stone-900 truncate">{username}</h4>

					<div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
              {date}
            </span>

						<button
							onClick={onToggleFollow}
							className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full transition-all shrink-0 ${
								isFollowing
									? "bg-stone-100 text-stone-600 hover:bg-stone-200"
									: "bg-rippl-600 text-white hover:bg-rippl-700"
							}`}
						>
							{isFollowing ? "Abonné" : "Suivre"}
						</button>
					</div>
				</div>
				<p className="text-xs font-medium text-rippl-600">@{username}</p>
			</div>
		</div>
	);
};