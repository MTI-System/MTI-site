import React from "react";
import styles from "@/styles/Dialogs/modalDialog.module.css"

function ModalDialog({ isOpen, onClose, children }: {isOpen: boolean, onClose: Function, children: React.ReactNode }) : React.ReactElement | null {
  if (!isOpen) return null;
  return(
        <div className={styles.fone}>
          <div className={styles.modal}>
                {children}
          </div>
        </div>
  )
}

export default ModalDialog;