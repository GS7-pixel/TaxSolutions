function FileUpload({ id, label, selectedFileName, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept=".xls,.xlsx"
        onChange={onChange}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
      />
      <p className="mt-2 text-xs text-slate-500">
        {selectedFileName ? `Selected: ${selectedFileName}` : 'No file selected'}
      </p>
    </div>
  )
}

export default FileUpload
