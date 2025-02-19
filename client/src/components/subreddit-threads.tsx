import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Plus, Check, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { subscribeToSubreddit } from "@/services/subreddit/subredditService"
import { voteThread } from "@/services/threads/votes/votesService"
import { fetchThreads, updateThreadVotes } from "@/services/threads/threadService"
import { ThreadSkeleton } from "./thread-skeleton"

export interface Thread {
  id: number
  title: string
  subreddit: string
  author: string
  content?: string
  votes: number
  vote: 1 | -1 | number | null;
  num_comments: number
}

export interface Subreddit {
	id: number
	avatar: string
	description: string
	members: number
	name: string
	subscribed?: boolean
	created_at: string,
	updated_at: string,
	created_utc: number,
}

interface SubredditThreadsProps {
  subreddit?: Subreddit

}

export function SubredditThreads({ subreddit }: SubredditThreadsProps) {
  const [isJoined, setIsJoined] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingVotes, setLoadingVotes] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [threads, setThreads] = useState<Thread[]>([])

  const observer = useRef<IntersectionObserver | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (subreddit) {
      setIsJoined(subreddit.subscribed || false)
    }
  }, [subreddit])

  const handleJoinClick = async (id: number | undefined) => {
    setLoading(true)
    await subscribeToSubreddit(id)
    setLoading(false)
    setIsJoined((prev) => !prev)
  }

  const lastSubredditElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore],
  )

  const loadThreads = useCallback(
    async (page: number) => {
      if (!subreddit) return
      try {
        setIsLoading(true)
        const threadsData = await fetchThreads(page, subreddit.name.replace(/^r\//, ''));
        setThreads((prevThreads) => [...prevThreads, ...threadsData.threads])
        setHasMore(threadsData.threads.length > 0)
      } catch (error) {
        console.error("Error loading subreddits:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [subreddit],
  )

  useEffect(() => {
    if (subreddit && isFirstRender.current) {
      isFirstRender.current = false
      loadThreads(currentPage)
    } else if (subreddit && currentPage > 1) {
      loadThreads(currentPage)
    }
  }, [currentPage, loadThreads, subreddit])
  
  
  const handleVote = async (threadId: number, newVoteType: 1 | -1) => {
    setThreads((prevThreads) => {
      let currentVote: 1 | -1 | number | null = null;
      let voteDiff = 0;
      
      const updatedThreads = prevThreads.map((thread) => {
        if (thread.id === threadId) {
          currentVote = thread.vote;
          
          if (currentVote === newVoteType) {
            // If clicking the same vote type, remove the vote
            voteDiff = -newVoteType;
            return {
              ...thread,
              votes: thread.votes + voteDiff,
              vote: null,
            };
          } else {
            // If changing vote or voting for the first time
            voteDiff = currentVote ? newVoteType * 2 : newVoteType;
            return {
              ...thread,
              votes: thread.votes + voteDiff,
              vote: newVoteType,
            };
          }
        }
        return thread;
      });
      
      // Perform the API call after the state update
      (async () => {
        try {
          setLoadingVotes(true)
          const threadToUpdate = updatedThreads.find(t => t.id === threadId);
          if (threadToUpdate) {
            await voteThread(threadId, threadToUpdate.vote === null ||  threadToUpdate.vote === undefined ? 0 : threadToUpdate.vote);
            await updateThreadVotes(threadToUpdate.id, threadToUpdate.votes)
            console.log("Vote updated successfully", threadToUpdate);
          }
        } catch (error) {
          console.error("Failed to update vote on server:", error);
          // Revert the optimistic update
          setThreads((prevThreads) =>
            prevThreads.map((thread) => 
              thread.id === threadId ? {...thread, vote: currentVote, votes: thread.votes - voteDiff} : thread
        )
      );
        }
        finally {
          setLoadingVotes(false)
        }
      })();
      
      return updatedThreads;
    });
  };
  
  if (currentPage === 1 && isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ThreadSkeleton />
      </div>
    )
  }
  
  return (
    <Card style={{margin: '0px 10px 0px 10px'}} className="w-full max-w-3xl mx-auto h-full">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold">r/{subreddit && subreddit.name}</CardTitle>
          </div>
          <Button
            onClick={() => handleJoinClick(subreddit && subreddit.id)}
            variant={isJoined ? "secondary" : "default"}
            size="sm"
            className={cn(
              "flex items-center gap-2",
              isJoined
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <Loader2 style={{ display: loading ? "block" : "none" }} className="animate-spin" />
            {isJoined ? (
              <>
                <Check className="w-4 h-4" />
                Joined
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Join
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{subreddit && subreddit.members.toLocaleString()} members</Badge>
          <span>•</span>
          <span>
            Created {subreddit?.created_utc ? new Date(subreddit.created_utc * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100vh-200px)]">
      <ScrollArea className="h-full pr-4">
          {threads.map((thread, index) => (
            <div key={thread.id} ref={index === threads.length - 1 ? lastSubredditElementRef : null} className="mb-4 flex">
              <div style={{marginBlock: 'auto'}} className="flex flex-col items-center mr-4">
                <Button
                  disabled={loadingVotes}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    thread.vote === 1
                      ? "text-orange-600"
                      : "text-muted-foreground hover:text-orange-600 hover:bg-[rgba(231,111,63,0.16)]",
                  )}
                  onClick={() => handleVote(thread.id, 1)}
                >
                  <ArrowBigUp className="h-6 w-6" />
                </Button>
                <span className="text-sm font-medium">{thread.votes}</span>
                <Button
                  disabled={loadingVotes}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    thread.vote === -1
                      ? "text-blue-600"
                      : "text-muted-foreground hover:text-blue-600 hover:bg-[rgba(76,102,247,0.16)]",
                  )}
                  onClick={() => handleVote(thread.id, -1)}
                >
                  <ArrowBigDown className="h-6 w-6" />
                </Button>
              </div>
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{thread.title}</h3>
                  <div className="flex items-center mb-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={`https://avatar.vercel.sh/${thread.author}`} />
                      <AvatarFallback>{thread.author[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>
                      Posted by u/{thread.author}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{thread.content && thread.content.substring(0, 165)}...</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{thread.num_comments} comments</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

