import { animate, createScope, Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import style from "@/styles/components/ui/Files/addFileField.module.css"
import clsx from "clsx"

export default function AddFileField({
  onFileSet,
  disabled,
}: {
  onFileSet: (file: File | null) => void
  disabled: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const targetRef = useRef<HTMLLabelElement>(null)
  const scopeRef = useRef<Scope>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  useEffect(() => {
    scopeRef.current = createScope({ root: targetRef }).add((self) => {
      if (!self) return
      const animTime = 500
      const horizontalLineAnim = animate(`svg path.${style.iconHorizontalLine}`, {
        translateY: [0, "-180px"],
        duration: animTime,
        ease: "outCubic",
        autoplay: false,
      })
      const angleAnim = animate(`svg rect.${style.iconAngle}`, {
        translateY: ["-225px", 0],
        ease: "inOutCubic",
        duration: animTime * 1.5,
        autoplay: false,
      })
      const boxAnim = animate(`svg`, {
        translateY: [0, "-1rem"],
        ease: "outQuad",
        duration: animTime * 1.5,
        autoplay: false,
        onComplete: (anim) => {
          if (!fileInputRef.current?.value || !anim.backwards) return
          rotateBoxAnim.play()
        },
      })
      const rotateBoxAnim = animate(`svg`, {
        rotate: [0, "45deg"],
        ease: "inOutQuad",
        duration: animTime / 2,
        autoplay: false,
        onComplete: (anim) => {
          if (!fileInputRef.current?.value || !anim.backwards) return
          horizontalLineAnim.play()
          angleAnim.play()
          boxAnim.play()
          // console.log(fileInputRef.current, anim.backwards)
          // if (!fileInputRef.current?.value || !anim.backwards) return
          // console.log("Yeeeaaahhh!")
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
    return () => {
      scopeRef.current?.revert()
    }
  }, [])
  return (
    <label
      className={clsx(style.fileInputField, { [style.disabledInput]: disabled })}
      ref={targetRef}
      onDragOver={(e) => {
        e.preventDefault()
        if (disabled) return
        targetRef.current?.classList.add(style.dragOver)
        scopeRef.current?.methods.uploadPlay()
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (disabled) return
        targetRef.current?.classList.remove(style.dragOver)
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
        targetRef.current?.classList.remove(style.dragOver)
        scopeRef.current?.methods.uploadRevert()
      }}
    >
      <input
        style={{ display: "none" }}
        type="file"
        multiple={false}
        ref={fileInputRef}
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
            className={style.iconAngle}
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
          className={style.iconHorizontalLine}
          fill="currentColor"
          d="M 48 224 C 30.3 224 16 238.3 16 256 S 30.3 288 48 288 L 400 288 C 417.7 288 432 273.7 432 256 S 417.7 224 400 224 Z"
        ></path>
        <path
          className={style.iconVerticalLine}
          fill="currentColor"
          d="M 256 80 C 256 62.3 241.7 48 224 48 S 192 62.3 192 80 L 192 432 C 192 449.7 206.3 464 224 464 S 256 449.7 256 432 Z"
        ></path>
      </svg>
      <p className={style.fileInputPlaceholder}>{!currentFile ? <>Добавить файл</> : <>{currentFile.name}</>}</p>
    </label>
  )
}
