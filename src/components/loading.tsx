"use client"
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Loading() {
  const t = useTranslations("util");
  return (
    <div className="size-full flex-1 flex flex-col items-center justify-center">
      <div className="w-2/5 aspect-5/1 relative m-4">
        <Image
          className="animate-pulse"
          src={`${process.env.NEXT_PUBLIC_ADMIN_BASE_PATH}/logo.svg`}
          alt="logo"
          fill
          unoptimized
        />
      </div>
      <span className="text-on-foreground text-[24px]">{t("loading")}</span>
    </div>
  );
}
