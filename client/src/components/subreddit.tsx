import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, ArrowUpRight } from "lucide-react"
import { subscribeToSubreddit } from "@/services/subreddit/subredditService"
import { Loader2 } from "lucide-react"
import { getRandomString } from "@/utils"
import { useNavigate } from "react-router-dom"

export interface Subreddit {
  id: number
  name: string
  description: string
  members: number
  avatar: string
  subscribed?: boolean | null
}


export const SubredditCard: React.FC<{ subreddit: Subreddit }> = ({ subreddit }) => {
  const [isJoined, setIsJoined] = useState(subreddit.subscribed);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleJoinClick = async (id: number) => {
    setLoading(true);
    await subscribeToSubreddit(id);
    setLoading(false);
    setIsJoined((prev) => !prev);
  };

  return (
    <Card className="w-full max-w-md h-[250px] flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4 group">
        <Avatar className="transition-transform duration-300 group-hover:scale-110">
          <AvatarImage  src={subreddit.avatar.includes('avatar.vercel') 
                        ? `${subreddit.avatar}/${getRandomString()}` 
                        : subreddit.avatar}
                        alt={subreddit.name}  />
          <AvatarFallback>{subreddit.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="transition-colors duration-300 group-hover:text-primary">{subreddit.name}</CardTitle>
          <CardDescription>{subreddit.members.toLocaleString()} members</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <p className="line-clamp-3 transition-colors duration-300 hover:text-gray-300">{subreddit.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Button
          disabled={loading}
          variant={isJoined ? "default" : "outline"}
          size="sm"
          onClick={() => handleJoinClick(subreddit.id)}
          className={`transition-all duration-300 ${
            isJoined ? "bg-green-500 hover:bg-green-600" : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Loader2 style={{ display: loading ? "block" : "none" }} className="animate-spin" />
          <Users className="mr-2 h-4 w-4" />
          {isJoined ? "Joined" : "Join"}
        </Button>
        <Button
          onClick={() => navigate({
            pathname: `/subreddit/${subreddit.name.replace(/^r\//, '')}`,
            search: `?id=${subreddit.id}`,
          })}
          variant="ghost"
          size="sm"
          className="transition-colors duration-300 hover:bg-secondary hover:text-secondary-foreground"
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
};


