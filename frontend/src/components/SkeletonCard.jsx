export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-start gap-4">
      <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-zinc-800 animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-zinc-800 rounded-md animate-pulse w-3/4" />
        <div className="h-3 bg-zinc-800 rounded-md animate-pulse w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-zinc-800 rounded-md animate-pulse" />
          <div className="h-5 w-20 bg-zinc-800 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  )
}
