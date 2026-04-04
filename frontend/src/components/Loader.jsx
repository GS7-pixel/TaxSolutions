function Loader() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      <p className="text-sm font-medium text-slate-600">Processing...</p>
    </div>
  )
}

export default Loader
