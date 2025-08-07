import { useState } from "react"

export default function useInternship() {
  const [openIntensipModal, setOpenIntenshopModal] = useState(false)
  const toggleModal = () => {
    setOpenIntenshopModal(!openIntensipModal)
    }
  return {openIntensipModal, toggleModal, setOpenIntenshopModal}
}
