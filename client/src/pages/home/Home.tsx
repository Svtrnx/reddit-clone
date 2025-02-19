import { useEffect, useState, useRef, useCallback } from "react"
import { SubredditCard, type Subreddit } from "@/components/subreddit"
import { fetchSubreddits } from "@/services/subreddit/subredditService"
import { useAppSelector } from "@/hooks/reduxHooks"
import { SkeletonCard } from "@/components/card-skeleton"

const Home = () => {
  const { user } = useAppSelector((state) => state.user)
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)
  const isFirstRender = useRef(true)

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

  const loadSubreddits = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true)
        const data = await fetchSubreddits(page)
        const newSubreddits = data.subreddits.map((subreddit: Subreddit) => ({
          ...subreddit,
          subscribed: user?.subscribed_subreddits?.includes(subreddit.id) ?? false,
        }))
        setSubreddits((prevSubreddits) => [...prevSubreddits, ...newSubreddits])
        setHasMore(data.subreddits.length > 0)
      } catch (error) {
        console.error("Error loading subreddits:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [user?.subscribed_subreddits],
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      loadSubreddits(currentPage)
    } else if (currentPage > 1) {
      loadSubreddits(currentPage)
    }
  }, [currentPage, loadSubreddits])

  if (currentPage === 1 && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 21 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 style={{display: isLoading ? 'none' : ''}} className="subbreddit-h2 text-2xl font-bold text-gray-200 text-center mb-8">Subreddits</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subreddits.map((subreddit: Subreddit, index: number) => (
          <div
            key={`${subreddit.id}-${index}`}
            ref={index === subreddits.length - 1 ? lastSubredditElementRef : null}
            className="h-[280px]"
          >
            <SubredditCard subreddit={subreddit} />
          </div>
        ))}
      </div>
      {!isLoading && !hasMore && (
        <div className="mt-6 text-center font-mono text-sm text-gray-400">No more subreddits to load</div>
      )}
    </div>
  )
}

export default Home

