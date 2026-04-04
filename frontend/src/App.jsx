import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Loader from './components/Loader'
import SummaryCard from './components/SummaryCard'

function App() {
  const [purchaseFile, setPurchaseFile] = useState(null)
  const [gstrFile, setGstrFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  console.log(purchaseFile, gstrFile)

  const handleGenerate = async () => {
    if (!purchaseFile || !gstrFile) {
      return
    }

    setLoading(true)
    setResults(null)
    console.log('Sending files to backend:', {
      purchaseFileName: purchaseFile.name,
      purchaseFileSize: purchaseFile.size,
      gstrFileName: gstrFile.name,
      gstrFileSize: gstrFile.size,
    })

    try {
      const formData = new FormData()
      formData.append('purchase_file', purchaseFile)
      formData.append('gstr2b_file', gstrFile)

      const response = await fetch('http://127.0.0.1:8000/generate-reco', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reconciliation')
      }

      setResults({
        totalGSTIN: data.summary?.total_gstin ?? 0,
        matched: data.summary?.total_matched ?? 0,
        mismatched: data.summary?.total_mismatched ?? 0,
        missingIn2B: data.summary?.missing_in_2b ?? 0,
        missingInBooks: data.summary?.missing_in_books ?? 0,
      })
      alert('Reconciliation complete')
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow md:p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800 md:text-3xl">
          GST Reconciliation Tool
        </h1>

        <section className="grid gap-4">
          <FileUpload
            id="purchase-register"
            label="Purchase Register (Excel)"
            selectedFileName={purchaseFile?.name}
            onChange={(e) => setPurchaseFile(e.target.files[0])}
          />

          <FileUpload
            id="gstr-2b"
            label="GSTR-2B File (Excel)"
            selectedFileName={gstrFile?.name}
            onChange={(e) => setGstrFile(e.target.files[0])}
          />
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !purchaseFile || !gstrFile}
            className="rounded-xl bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Generate Reconciliation
          </button>

          <button
            type="button"
            disabled={!results || loading}
            className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Download Reconciliation File
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 p-6">
          {loading && <Loader />}

          {!loading && results && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryCard label="Total GSTINs" value={results.totalGSTIN} />
              <SummaryCard label="Total Matches" value={results.matched} />
              <SummaryCard label="Total Mismatches" value={results.mismatched} />
              <SummaryCard label="Missing in 2B" value={results.missingIn2B} />
              <SummaryCard label="Missing in Books" value={results.missingInBooks} />
            </div>
          )}

          {!loading && !results && (
            <p className="text-sm text-slate-500">
              Upload both files and click generate to view reconciliation summary.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
