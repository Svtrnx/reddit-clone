import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SubredditThreads } from "@/components/subreddit-threads";
import { fetchSubreddit } from "@/services/subreddit/subredditService";
import { useAppSelector } from "@/hooks/reduxHooks"
import {   
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator, 
} from "@/components/ui/breadcrumb";

export interface Subreddit {
	id: number
	avatar: string
	description: string
	members: number
	name: string
	subscribed?: boolean | undefined
	created_at: string,
	updated_at: string,
	created_utc: number,
}
  

function SubredditThread() {
	const { user } = useAppSelector((state) => state.user)
	const [searchParams] = useSearchParams();
	const { subreddit } = useParams<{ subreddit: string }>();
	const subredditId = searchParams.get('id');
  	const [subredditData, setSubredditData] = useState<Subreddit>();
	
	const getSubreddit = async (subredditId: number) => {
		try {
			const subreddit_data = await fetchSubreddit(subredditId);
			const isSubscribed = user?.subscribed_subreddits.includes(subredditId);
			setSubredditData({
			...subreddit_data,
			subscribed: isSubscribed
			});
		} catch (error) {
			console.error('Error fetching subreddit:', error);
			return null;
		}	
	}

	useEffect(() => {
		getSubreddit(subredditId ? Number(subredditId) : 0);
	}, [subreddit]);


	return (
		<>
		<div style={{position: 'absolute', top: 0, left: 0, marginLeft: 20, marginTop: 10}}>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
					<BreadcrumbLink href="/home"><h2 className="breadcrumb-text">Home</h2></BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
					<BreadcrumbPage><h2 className="breadcrumb-text">r/{subreddit}</h2></BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
		<SubredditThreads subreddit={subredditData} />
		</>
	)
}

export default SubredditThread;
