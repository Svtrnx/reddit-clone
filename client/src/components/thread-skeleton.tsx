import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ThreadSkeleton() {
  return (
    <Card style={{margin: '0px 10px 0px 10px'}} className="w-full max-w-3xl mx-auto h-full">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100vh-200px)]">
        <ScrollArea className="h-full pr-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-4 flex">
              <div style={{marginBlock: 'auto'}} className="flex flex-col items-center mr-4">
                <Skeleton className="h-8 w-8 mb-1" />
                <Skeleton className="h-4 w-4 mb-1" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1" />
                    <Skeleton className="h-4 w-24" />
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
