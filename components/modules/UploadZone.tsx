'use client'

/**
 * UploadZone.tsx
 *
 * Core upload component. Handles file selection, drag & drop,
 * upload progress, and Shelby SDK integration.
 *
 * [PROTOTYPE] Simulates upload locally.
 * [REAL SDK]  Will call uploadToShelby() from lib/shelby.ts.
 */

import { useCallback, useRef, useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import toast from 'react-hot-toast'
import { Upload, CloudUpload } from 'lucide-react'
import { uploadToShelby, calculateXP, getFileIcon, formatFileSize } from '@/lib/shelby'
import { useGameStore } from '@/store/useGameStore'
import type { UploadedFile } from '@/types'

interface UploadZoneProps {
  onUploadComplete?: (files: UploadedFile[]) => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const { account, connected } = useWallet()
  const recordUpload = useGameStore((s) => s.recordUpload)

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return

      if (!connected || !account?.address) {
        toast('Connect your Petra wallet to upload files 👛', { icon: '⚠️' })
        return
      }

      setIsUploading(true)
      const uploadedFiles: UploadedFile[] = []
      let totalSize = 0
      let hasImage = false

      try {
        for (const file of files) {
          setCurrentFile(file.name)
          setProgress(0)

          const result = await uploadToShelby(file, account.address, setProgress)
          const xp = calculateXP(file.size)
          const isImage = file.type.startsWith('image/')

          uploadedFiles.push({
            id: result.blobId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            blobId: result.blobId,
            txHash: result.txHash,
            isImage,
            xpEarned: xp,
          })

          totalSize += file.size
          if (isImage) hasImage = true
        }

        // Update game state
        recordUpload({
          fileCount: files.length,
          hasImage,
          totalSizeBytes: totalSize,
        })

        onUploadComplete?.(uploadedFiles)

        const fileLabel = files.length === 1 ? files[0].name : `${files.length} files`
        toast.success(`✅ Uploaded: ${fileLabel}`)
      } catch (error) {
        console.error('[UploadZone] Upload failed:', error)
        toast.error('Upload failed. Please try again.')
      } finally {
        setIsUploading(false)
        setCurrentFile(null)
        setProgress(0)
      }
    },
    [account, connected, recordUpload, onUploadComplete]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    handleFiles(files)
    e.target.value = ''
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed p-8 text-center
        transition-all duration-200 cursor-pointer
        ${isDragging
          ? 'border-orange bg-orange/5'
          : 'border-[var(--border)] hover:border-orange/50 hover:bg-orange/[0.02]'
        }
      `}
      onClick={() => !isUploading && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onInputChange}
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="space-y-3">
          <CloudUpload className="mx-auto text-orange animate-pulse" size={36} />
          <p className="text-sm font-medium text-white">
            Uploading to Shelby...
          </p>
          {currentFile && (
            <p className="text-xs text-muted truncate max-w-[200px] mx-auto">
              {currentFile}
            </p>
          )}
          {/* Progress bar */}
          <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange to-[var(--orange2)] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted font-mono">{progress}%</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="mx-auto text-muted" size={32} />
          <p className="text-sm font-semibold text-white">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted">
            Any file type · Stored on Shelby Network
          </p>
        </div>
      )}
    </div>
  )
}
