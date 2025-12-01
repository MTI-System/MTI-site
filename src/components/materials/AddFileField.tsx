import { animate, createScope, Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import twclsx from "@/utils/twClassMerge"

export default function AddFileField({
  defaultValue,
  onFileSet,
  disabled,
  accept,
  isInline = false,
  isError = false,
}: {
  defaultValue?: File | null
  onFileSet: (file: File | null) => void
  disabled: boolean
  accept: string
  isInline?: boolean
  isError?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const targetRef = useRef<HTMLLabelElement>(null)
  const scopeRef = useRef<Scope>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(defaultValue ?? null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    scopeRef.current = createScope({ root: targetRef }).add((self) => {
      if (!self) return
      const animTime = 500
      const horizontalLineAnim = animate("svg path.iconHorizontalLine", {
        translateY: [0, "-180px"],
        duration: animTime,
        ease: "outCubic",
        autoplay: false,
      })
      const angleAnim = animate("svg rect.iconAngle", {
        translateY: ["-225px", 0],
        ease: "inOutCubic",
        duration: animTime * 1.5,
        autoplay: false,
      })
      const boxAnim = animate("svg", {
        translateY: [0, "-1rem"],
        ease: "outQuad",
        duration: animTime * 1.5,
        autoplay: false,
        onComplete: (anim) => {
          if (!fileInputRef.current?.value || !anim.backwards) return
          rotateBoxAnim.play()
        },
      })
      const rotateBoxAnim = animate("svg", {
        rotate: [0, "45deg"],
        ease: "inOutQuad",
        duration: animTime / 2,
        autoplay: false,
        onComplete: (anim) => {
          if (!fileInputRef.current?.value || !anim.backwards) return
          horizontalLineAnim.play()
          angleAnim.play()
          boxAnim.play()
        },
      })
      self.add("uploadPlay", () => {
        if (fileInputRef.current?.value) {
          rotateBoxAnim.reverse()
          return
        }
        horizontalLineAnim.play()
        angleAnim.play()
        boxAnim.play()
      })
      self.add("uploadRevert", () => {
        horizontalLineAnim.reverse()
        angleAnim.reverse()
        boxAnim.reverse()
      })
      self.add("silentFileAdd", () => {
        rotateBoxAnim.play()
      })
      self.add("deleteSelectedFile", () => {
        rotateBoxAnim.reverse()
      })
    })
    if (defaultValue) {
      scopeRef.current?.methods.silentFileAdd()
    }

    return () => {
      scopeRef.current?.revert()
    }
  }, [])
  return (
    <label
      className={twclsx(
        "border-border text-text-alt bg-text-alt/25 hover:text-text-main hover:bg-text-alt/35 flex w-full flex-col content-center items-center justify-center rounded-2xl border-4 border-dashed p-10 text-8xl transition-colors duration-300",
        {
          "text-text-alt/50 bg-text-alt/125 hover:text-text-alt/50 hover:bg-text-alt/125": disabled,
          "flex-row gap-4 py-6 text-2xl": isInline,
          "bg-text-alt/35 text-text-main": isDragOver,
          "border-accent-warning bg-accent-warning-alt text-accent-warning hover:text-accent-warning/75 hover:bg-accent-warning-alt/75":
            isError,
        },
      )}
      ref={targetRef}
      onDragOver={(e) => {
        e.preventDefault()
        if (disabled) return
        setIsDragOver(true)
        scopeRef.current?.methods.uploadPlay()
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (disabled) return
        setIsDragOver(false)
        scopeRef.current?.methods.uploadRevert()
        if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files
        if (e.dataTransfer.items) {
          const item = e.dataTransfer.items[0]
          if (item.kind === "file") {
            const newFile = item.getAsFile()
            if (!newFile) return
            setCurrentFile(newFile)
            onFileSet(newFile)
          }
        } else {
          const newFile = e.dataTransfer.files[0]
          setCurrentFile(newFile)
          onFileSet(newFile)
        }
      }}
      onDragLeave={() => {
        if (disabled) return
        setIsDragOver(false)
        scopeRef.current?.methods.uploadRevert()
      }}
    >
      <input
        style={{ display: "none" }}
        type="file"
        multiple={false}
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => {
          if (!e.target.files) return
          scopeRef.current?.methods.silentFileAdd()
          const newFile = e.target.files[0]
          setCurrentFile(newFile)
          onFileSet(newFile)
        }}
        disabled={disabled}
      />
      <svg
        stroke="currentColor"
        fill="transparent"
        strokeWidth="0"
        viewBox="0 0 448 512"
        className="shrink-0"
        height="1em"
        width="1em"
        onClick={(e) => {
          if (!currentFile) return
          e.stopPropagation()
          e.preventDefault()
          scopeRef.current?.methods.deleteSelectedFile()
          if (fileInputRef.current) fileInputRef.current.value = ""
          onFileSet(null)
          setCurrentFile(null)
        }}
      >
        <clipPath id="angleClip">
          <rect
            className="iconAngle origin-center"
            x={50}
            y={50}
            width={330}
            height={280}
            style={{ transform: "translateY(-225px)" }}
          />
        </clipPath>
        <path
          id="uploadAngle"
          d="M 76.9 207.8 C 64.4 220.3 64.4 240.6 76.9 253.1 S 109.7 265.6 122.2 253.1 L 224 151.3 L 325.8 253.1 C 338.3 265.6 358.6 265.6 371.1 253.1 S 383.6 220.3 371.1 207.8 L 269.3 106 L 178.7 106 L 76.9 207.8 Z"
        ></path>
        <use clipPath="url(#angleClip)" href="#uploadAngle" fill="currentColor" />

        <path
          className="iconHorizontalLine origin-center"
          fill="currentColor"
          d="M 48 224 C 30.3 224 16 238.3 16 256 S 30.3 288 48 288 L 400 288 C 417.7 288 432 273.7 432 256 S 417.7 224 400 224 Z"
        ></path>
        <path
          className="iconVerticalLine origin-center"
          fill="currentColor"
          d="M 256 80 C 256 62.3 241.7 48 224 48 S 192 62.3 192 80 L 192 432 C 192 449.7 206.3 464 224 464 S 256 449.7 256 432 Z"
        ></path>
      </svg>
      <p
        className={twclsx(
          "w-full overflow-hidden text-center text-2xl text-nowrap break-all text-ellipsis select-none",
          { "w-auto": isInline },
        )}
      >
        {!currentFile ? <>Добавить файл</> : <>{currentFile.name}</>}
      </p>
    </label>
  )
}
