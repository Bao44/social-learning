"use client"

import { useLanguage } from "@/components/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface ModalSearchNewChatProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ModalSearchNewChat({ open, setOpen }: ModalSearchNewChatProps) {
  const { t } = useLanguage()
  const [searchFocus, setSearchFocus] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            {t("dashboard.newMessage")}
          </DialogTitle>
          <div className="flex items-center gap-2 border-y border-gray-500 py-4">
            <span className="font-semibold">{t("dashboard.to")}:</span>
            <input
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              type="text"
              className="w-full h-10 p-2 border border-gray-300 rounded-md"
              placeholder={t("dashboard.recipient")}
            />
          </div>
        </DialogHeader>

        {/* 🔧 Thay DialogDescription bằng div */}
        <div className="mt-2 min-h-96 text-sm text-muted-foreground">
          {searchFocus ? (
            <div>{/* List query */}</div>
          ) : (
            <>
              <span className="font-semibold text-black">
                {t("dashboard.recommendations")}
              </span>
              {/* List suggestion */}
            </>
          )}
        </div>

        <div className="flex justify-center items-center">
          <Button variant="default" className="w-fit">
            {t("dashboard.sendMessage")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
